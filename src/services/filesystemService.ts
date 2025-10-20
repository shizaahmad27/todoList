import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

export const dataDirectory = Directory.Data

export const listsIndexPath = 'lists/_index.json'

export async function readJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const result = await Filesystem.readFile({ path, directory: dataDirectory, encoding: Encoding.UTF8 })
    const text = String(result.data)
    return JSON.parse(text)
  } catch (_err) {
    return fallback
  }
}

export async function writeJson<T>(path: string, data: T): Promise<void> {
  const content = JSON.stringify(data)
  await Filesystem.writeFile({ path, data: content, directory: dataDirectory, recursive: true, encoding: Encoding.UTF8 })
}

export function listFilenameFromSlug(slug: string): string {
  return `lists/${slug}.json`
}

export async function deleteFile(path: string): Promise<void> {
  try {
    await Filesystem.deleteFile({ path, directory: dataDirectory })
  } catch (_err) {
      console.log("Error deleting file")
   
  }
}


