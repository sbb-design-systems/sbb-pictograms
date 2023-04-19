import * as Figma from 'figma-js';
import { readFileSync, writeFileSync } from 'fs';
import { Octokit } from 'octokit';
import { optimize } from 'svgo';

const pictogramsFileId = process.env.FIGMA_FILE_ID!;
const pictogramBatchSize = 200;
const figmaToken = process.env.FIGMA_TOKEN!;
const githubToken = process.env.GITHUB_TOKEN!;
const repositorySlug = process.env.GITHUB_REPOSITORY!;

interface Description {
  color?: boolean;
  scalable?: boolean;
  keywords?: string;
}

(async () => {
  const errors: Array<{ message: string; severity: 'warn' | 'error' }> = [];
  const client = Figma.Client({ personalAccessToken: figmaToken });
  const octokit = new Octokit({ auth: githubToken });
  let components: Record<string, Figma.ComponentMetadata> = {};

  class SvgIcon {
    url?: string;

    constructor(
      readonly fullPath: Figma.Node[],
      readonly path = fullPath.slice(0, fullPath.length - 1),
      readonly pathAsString = fullPath.map((n) => n.name).join(' => '),
      readonly component = fullPath.at(-1) as Figma.Component,
      readonly id = component.id,
      readonly fileName = createIconFileName(fullPath, component, pathAsString),
      readonly description = tryParseJSON<Description>(
        components[id]?.description,
        id,
        pathAsString
      ),
      readonly keywords = [
        ...splitKeywords(description.keywords),
        ...fullPath.map((n) => n.name),
      ]
    ) {}

    valid() {
      return !!(this.fileName && this.url);
    }
  }

  try {
    await extractPictograms();
  } catch (e) {
    console.log(e);
    const [owner, repo] = repositorySlug.split('/');
    const assignees = findAssignees();
    await octokit.rest.issues.create({
      owner,
      repo,
      title: `Icon Release Failure`,
      assignees,
      body: `Icon extraction failed due to: ${e}\n\n${errors
        .map((e) => `${e.severity} ${e.message}`)
        .join('\n')}`,
    });
    process.exit(1);
  }

  async function extractPictograms() {
    const file = await client.file(pictogramsFileId);
    if (file.status >= 400) {
      throw new Error(`File request failed: ${file.statusText}`);
    }
    console.log(`Loaded file from figma`);
    components = file.data.components;
    const pictogramComponents = traverseChildren(file.data.document);
    console.log(`Found ${pictogramComponents.length} pictograms`);
    const pictogramList = await batchIconRequests(pictogramComponents);
    const invalidPictograms = pictogramList.filter((i) => !i.valid());
    if (invalidPictograms.length) {
      console.log(
        `Found ${
          invalidPictograms.length
        } invalid pictograms:\n${invalidPictograms
          .map((i) => ` - ${i.pathAsString}`)
          .join('\n')}`
      );
    }
    const validPictograms = pictogramList.filter((i) => i.valid());

    console.log('Generating index.json');
    const packageJson = readFileSync(
      new URL('../package.json', import.meta.url),
      'utf-8'
    );
    const data = {
      version: JSON.parse(packageJson).version,
      pictograms: validPictograms.map((i) => ({
        name: i.fileName.replace(/.svg$/, ''),
        color: !!i.description.color,
        scalable: i.description.scalable,
        tags: i.keywords,
      })),
    };
    writeFileSync(
      new URL('../pictograms/index.json', import.meta.url),
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log('Starting svg download');
    let index = 0;
    for (const pictogram of validPictograms) {
      const response = await fetch(pictogram.url!);
      if (response.status !== 200) {
        errors.push({
          message: `Failed to download pictogram for ${pictogram.fileName}`,
          severity: 'error',
        });
      } else {
        const content = await response.text();
        const minifiedContent = optimize(content, {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        });
        if (minifiedContent.error !== undefined) {
          errors.push({
            message: `Failed to minify pictogram ${pictogram.fileName} due to ${minifiedContent.error}`,
            severity: 'warn',
          });
        } else {
          let svg = minifiedContent.data;
          if (!pictogram.description.color) {
            svg = svg.replace('<svg ', `<svg class="color-immutable" `);
          }
          writeFileSync(
            new URL(`../pictograms/${pictogram.fileName}`, import.meta.url),
            svg,
            'utf-8'
          );
        }
      }
      index++;
      if (index % 50 === 0) {
        console.log(`Finished ${index} svg downloads`);
      }
    }

    console.log('Finished all svg downloads');
    if (errors.length) {
      errors.forEach((e) => console.log(`${e.severity} ${e.message}`));
      throw new Error(`Finished with ${errors.length} errors`);
    }
    console.log('Successfully completed');
  }

  function traverseChildren(
    node: Figma.Node,
    path: Figma.Node[] = []
  ): SvgIcon[] {
    if (!('children' in node)) {
      return [];
    }

    return node.children
      .filter((c) => !c.name.startsWith('_'))
      .map((child) => ({ child, newPath: [...path, child] }))
      .map(({ child, newPath }) =>
        child.type === 'COMPONENT'
          ? [new SvgIcon(newPath)]
          : traverseChildren(child, newPath)
      )
      .reduce((previous, current) => previous.concat(current));
  }

  async function batchIconRequests(
    pictograms: SvgIcon[],
    pictogramMap: Map<string, SvgIcon> = new Map()
  ): Promise<SvgIcon[]> {
    console.log(
      `Starting pictogram url batch request for ${pictogramMap.size} to ${
        pictogramMap.size + pictogramBatchSize
      }`
    );
    const requestBatch = pictograms.slice(0, pictogramBatchSize);
    for (const pictogram of requestBatch) {
      if (pictogramMap.has(pictogram.component.id)) {
        errors.push({
          message: `Duplicate pictogram id ${pictogram.id} (${pictogram.fileName})`,
          severity: 'warn',
        });
      }
      pictogramMap.set(pictogram.component.id, pictogram);
    }

    const response = await client.fileImages(pictogramsFileId, {
      ids: requestBatch.map((i) => i.component.id),
      format: 'svg',
    });
    if (response.status >= 400 || response.data.err) {
      throw new Error(
        `File request failed: ${response.statusText} ${response.data.err}`
      );
    }

    for (const [id, url] of Object.entries(response.data.images)) {
      const pictogram = pictogramMap.get(id);
      if (!pictogram) {
        errors.push({
          message: `Received response for unknown pictogram: ${id}`,
          severity: 'warn',
        });
      } else {
        pictogram.url = url;
      }
    }

    if (pictograms.length > pictogramBatchSize) {
      return await batchIconRequests(
        pictograms.slice(pictogramBatchSize),
        pictogramMap
      );
    }

    return Array.from(pictogramMap.values());
  }

  function createIconFileName(
    path: Figma.Node[],
    component: Figma.Component,
    pathAsString: string
  ) {
    if (!component.name.includes('=')) {
      return `${component.name.toLowerCase()}.svg`;
    }

    const parent = path.at(-2)!;
    const {
      direction,
      language,
      value,
      'value-size': valueSize,
    } = component.name
      .toLowerCase()
      .split(/[, ]+/g)
      .map((n) => n.split('=', 2))
      .reduce(
        (current, next) => Object.assign(current, { [next[0]]: `-${next[1]}` }),
        {} as Record<string, string>
      );

    return `${parent.name.split('/')!.at(-1)!.toLowerCase()}${value ?? ''}${
      direction ?? ''
    }${language ?? ''}${valueSize ?? ''}.svg`;
  }

  function tryParseJSON<T>(
    content: string | undefined,
    id: string,
    pathAsString: string
  ): Partial<T> {
    if (!content) {
      errors.push({
        message: `No data for ${id} in ${pathAsString}`,
        severity: 'warn',
      });
      return {};
    }

    try {
      return JSON.parse(content);
    } catch (e) {
      errors.push({
        message: `Failed to parse ${id} in ${pathAsString}\n${content}`,
        severity: 'warn',
      });
      return {};
    }
  }

  function splitKeywords(keyword: string | string[] | undefined): string[] {
    if (!keyword) {
      return [];
    } else if (typeof keyword === 'string') {
      return keyword.split(/[, ]+/);
    } else {
      return keyword;
    }
  }

  // Read the assignes from the CODEOWNERS file. Only use global (*) code owners.
  function findAssignees(): string[] {
    const codeOwners = readFileSync(
      new URL('../.github/CODEOWNERS', import.meta.url),
      'utf-8'
    );
    const codeOwnerList =
      codeOwners
        .split('\n')
        .find((l) => l.trim().startsWith('*'))
        ?.trim()
        .substring(1)
        .split(/[ @]+/)
        .filter((c) => !!c) ?? [];
    if (!codeOwnerList.length) {
      throw new Error(`Missing global code owners in CODEOWNERS file`);
    }

    return codeOwnerList;
  }
})();
