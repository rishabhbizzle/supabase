import { MDXProvider } from '@mdx-js/react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { IconExternalLink } from 'ui'
import components from '~/components'
import { highlightSelectedTocItem } from '~/components/CustomHTMLElements/CustomHTMLElements.utils'
import { FooterHelpCalloutType } from '~/components/FooterHelpCallout'
import useHash from '~/hooks/useHash'
import { LayoutMainContent } from '../DefaultLayout'

interface Props {
  meta: {
    title: string
    description?: string // used in meta tags
    hide_table_of_contents?: boolean
    breadcrumb?: string
    subtitle?: string // used on the page under the H1
    footerHelpType?: FooterHelpCalloutType
    video?: string
    tocVideo?: string
    canonical?: string
  }
  children: any
  toc?: any
  currentPage?: string
  hideToc?: boolean
}

const Layout: FC<Props> = (props) => {
  const [hash] = useHash()

  const articleRef = useRef()
  const [tocList, setTocList] = useState([])

  const { asPath } = useRouter()
  const router = useRouter()

  const EDIT_BUTTON_EXCLUDE_LIST = ['/404']

  useEffect(() => {
    if (hash && tocList.length > 0) {
      highlightSelectedTocItem(hash as string)
    }
  }, [hash, JSON.stringify(tocList)])

  useEffect(() => {
    const articleEl = articleRef.current as HTMLElement

    if (!articleRef.current) return
    const headings = Array.from(articleEl.querySelectorAll('h2, h3'))
    const newHeadings = headings
      .filter((heading) => heading.id)
      .map((heading) => {
        const text = heading.textContent.replace('#', '')
        const link = heading.querySelector('a').getAttribute('href')
        const level = heading.tagName === 'H2' ? 2 : 3
        return { text, link, level }
      })
    setTocList(newHeadings)
  }, [])

  const hasTableOfContents = tocList.length > 0
  const tocVideoPreview = `http://img.youtube.com/vi/${props.meta.tocVideo}/0.jpg`

  // page type, ie, Auth, Database, Storage etc
  const ogPageType = asPath.split('/')[2]
  // open graph image url constructor
  const ogImageUrl = encodeURI(
    `https://obuldanrptloktxcffvn.functions.supabase.co/og-images?site=docs${
      ogPageType ? `&type=${ogPageType}` : ''
    }&title=${props.meta?.title}&description=${props.meta?.description}`
  )

  return (
    <>
      <Head>
        <title>{props.meta?.title} | Supabase Docs</title>
        <meta name="description" content={props.meta?.description} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <NextSeo
        canonical={props.meta?.canonical ?? `https://supabase.com/docs${asPath}`}
        openGraph={{
          url: `https://supabase.com/docs${asPath}`,
          type: 'article',
          videos: props.meta?.video && [
            {
              // youtube based video meta
              url: props.meta?.video,
              width: 640,
              height: 385,
              type: 'application/x-shockwave-flash',
            },
          ],
          article: {
            publishedTime: new Date().toISOString(),
            modifiedTime: new Date().toISOString(),
            authors: ['Supabase'],
          },
        }}
      />
      <LayoutMainContent className="pb-0">
        <div className={['grid grid-cols-12 relative gap-4'].join(' ')}>
          <div
            className={[
              'relative',
              !props.hideToc ? 'col-span-12 md:col-span-9' : 'col-span-12',
              'transition-all ease-out',
              'duration-100',
            ].join(' ')}
          >
            {props.meta.breadcrumb && (
              <p className="text-brand-900 tracking-wider mb-3">{props.meta.breadcrumb}</p>
            )}
            <article
              ref={articleRef}
              className={`${
                props.meta?.hide_table_of_contents || !hasTableOfContents ? '' : ''
              } prose dark:prose-dark max-w-none`}
            >
              <h1 className="mb-0">{props.meta.title}</h1>
              {props.meta.subtitle && (
                <h2 className="mt-3 text-xl text-scale-1100">{props.meta.subtitle}</h2>
              )}
              <div className="w-full h-[1px] bg-scale-500 my-8"></div>
              <MDXProvider components={components}>{props.children}</MDXProvider>

              {EDIT_BUTTON_EXCLUDE_LIST.includes(router.route) ? (
                <></>
              ) : (
                <div className="mt-16 not-prose">
                  <div>
                    <Link
                      href={`https://github.com/supabase/supabase/edit/master/apps/docs/pages${router.asPath}.mdx`}
                      passHref
                    >
                      <a className="text-sm transition flex items-center gap-1 text-scale-1000 hover:text-scale-1200">
                        Edit this page on GitHub <IconExternalLink size={14} strokeWidth={1.5} />
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </article>
          </div>
          {!props.hideToc && hasTableOfContents && !props.meta?.hide_table_of_contents && (
            <div
              className={[
                'relative',
                !props.hideToc ? 'col-span-12 md:col-span-9' : 'col-span-12',
                'transition-all ease-out',
                'duration-100',
              ].join(' ')}
            >
              {props.meta.breadcrumb && (
                <p className="text-brand-900 tracking-wider mb-3">{props.meta.breadcrumb}</p>
              )}
              <article
                ref={articleRef}
                className={`${
                  props.meta?.hide_table_of_contents || !hasTableOfContents ? '' : ''
                } prose dark:prose-dark max-w-none`}
              >
                <h1 className="mb-0">{props.meta.title}</h1>
                {props.meta.subtitle && (
                  <h2 className="mt-3 text-xl text-scale-1100">{props.meta.subtitle}</h2>
                )}
                <div className="max-w-xs w-32 h-[1px] bg-gradient-to-r from-brand-800 to-brand-900 my-8"></div>
                <MDXProvider components={components}>{props.children}</MDXProvider>

                {EDIT_BUTTON_EXCLUDE_LIST.includes(router.route) ? (
                  <></>
                ) : (
                  <div className="mt-16 not-prose">
                    <div>
                      <Link
                        href={`https://github.com/supabase/supabase/edit/master/apps/docs/pages${router.asPath}.mdx`}
                        passHref
                      >
                        <a className="text-sm transition flex items-center gap-1 text-scale-1000 hover:text-scale-1200">
                          Edit this page on GitHub <IconExternalLink size={14} strokeWidth={1.5} />
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </article>
            </div>
          )}
        </div>
      </LayoutMainContent>
    </>
  )
}

export default Layout
