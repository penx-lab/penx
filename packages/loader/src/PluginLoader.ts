import * as autoFormat from '@penx/auto-format'
import * as autoNodeId from '@penx/auto-node-id'
import * as blockquote from '@penx/blockquote'
import * as checkList from '@penx/check-list'
import * as codeBlock from '@penx/code-block'
import * as divider from '@penx/divider'
import * as heading from '@penx/heading'
import * as image from '@penx/image'
import * as internalLink from '@penx/internal-link'
import * as link from '@penx/link'
import * as list from '@penx/list'
import { db } from '@penx/local-db'
import * as paragraph from '@penx/paragraph'
import * as storageEstimate from '@penx/storage-estimate'
import * as wordCount from '@penx/word-count'

const builtins = [
  { id: 'storage-estimate', activate: storageEstimate.activate },
  { id: 'word-count', activate: wordCount.activate },
  { id: 'blockquote', activate: blockquote.activate },
  { id: 'heading', activate: heading.activate },
  { id: 'divider', activate: divider.activate },
  { id: 'check-list', activate: checkList.activate },
  { id: 'auto-format', activate: autoFormat.activate },
  { id: 'list', activate: list.activate },
  { id: 'autoNodeId', activate: autoNodeId.activate },
  { id: 'paragraph', activate: paragraph.activate },
  { id: 'code-block', activate: codeBlock.activate },
  { id: 'image', activate: image.activate },
  { id: 'link', activate: link.activate },
  { id: 'internal-link', activate: internalLink.activate },
]

export class PluginLoader {
  async init() {
    this.initBuiltinPlugins()
    await this.initThirdPartyPlugins()
  }

  initBuiltinPlugins() {
    for (const plugin of builtins) {
      const ctx = Object.create(window.penx, {
        pluginId: {
          writable: false,
          configurable: false,
          value: plugin.id,
        },
      })
      plugin.activate(ctx)
    }
  }

  async initThirdPartyPlugins() {
    const plugins = await db.listPlugins()
    for (const item of plugins) {
      // eval(`
      // ${item.code}
      //   activate(Object.create(penx, {
      //     pluginId: {
      //         writable: false,
      //         configurable: false,
      //         value: "${item.manifest.id}"
      //       }
      //   }))
      // `)
      const script = document.createElement('script')
      script.type = 'module'

      script.innerHTML = `
        ${item.code}
        
        const ctx = Object.create(window.penx, {
          pluginId: {
              writable: false,
              configurable: false,
              value: "${item.manifest.id}"
            }
        })

        activate(ctx)
      `
      document.body.appendChild(script)
    }
  }
}
