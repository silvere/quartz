import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      // 给文件夹标签追加条目数：papers → papers (167)
      // 注意：mapFn 会被序列化（.toString()）后在浏览器再 eval，不能引用闭包外变量
      mapFn: (node) => {
        if (node.isFolder && node.slugSegment) {
          // 迭代统计所有非文件夹后代（避免递归在 .toString() 后失效）
          const stack = [...node.children]
          let count = 0
          while (stack.length) {
            const n = stack.pop()
            if (!n) continue
            if (n.isFolder) {
              for (const c of n.children) stack.push(c)
            } else {
              count++
            }
          }
          if (count > 0) {
            node.displayName = `${node.displayName} (${count})`
          }
        }
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      // 给文件夹标签追加条目数：papers → papers (167)
      // 注意：mapFn 会被序列化（.toString()）后在浏览器再 eval，不能引用闭包外变量
      mapFn: (node) => {
        if (node.isFolder && node.slugSegment) {
          // 迭代统计所有非文件夹后代（避免递归在 .toString() 后失效）
          const stack = [...node.children]
          let count = 0
          while (stack.length) {
            const n = stack.pop()
            if (!n) continue
            if (n.isFolder) {
              for (const c of n.children) stack.push(c)
            } else {
              count++
            }
          }
          if (count > 0) {
            node.displayName = `${node.displayName} (${count})`
          }
        }
      },
    }),
  ],
  right: [],
}
