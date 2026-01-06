'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { useLanguage } from '@/lib/LanguageContext'
import { getTranslation } from '@/lib/translations'
import { getImageUrl } from '@/utils/imageUtils'

export function PrimaryFeatures() {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const journalistFeatures = [
    {
      title: t.primaryFeatures.journalistFeatures.publish.title,
      description: t.primaryFeatures.journalistFeatures.publish.description,
      image: getImageUrl('web/features/feature3.png'),
    },
    {
      title: t.primaryFeatures.journalistFeatures.video.title,
      description: t.primaryFeatures.journalistFeatures.video.description,
      image: getImageUrl('web/features/feature3.png'),
    },
  ]

  const userFeatures = [
    {
      title: t.primaryFeatures.userFeatures.content.title,
      description: t.primaryFeatures.userFeatures.content.description,
      image: getImageUrl('web/features/feature1.png'),
    },
    {
      title: t.primaryFeatures.userFeatures.conversations.title,
      description: t.primaryFeatures.userFeatures.conversations.description,
      image: getImageUrl('web/features/feature2.png'),
    },
  ]
  const [isJournalist, setIsJournalist] = useState(false)
  const [tabOrientation, setTabOrientation] = useState('horizontal')
  
  const features = isJournalist ? journalistFeatures : userFeatures

  useEffect(() => {
    let lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      id="features"
      aria-label="Features for sharing your stories"
      className="relative overflow-hidden bg-white py-20 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {t.primaryFeatures.title}
          </h2>
          <p className="mt-6 text-lg tracking-tight text-slate-600">
            {t.primaryFeatures.subtitle}
          </p>
          
          {/* Modern Toggle Switch */}
          <div className="mt-12 flex items-center justify-center">
            <div className="inline-flex rounded-lg bg-gray-100 p-1.5 shadow-sm ring-1 ring-inset ring-gray-200">
              <button
                type="button"
                onClick={() => setIsJournalist(false)}
                className={clsx(
                  'relative rounded-md px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:ring-offset-2',
                  !isJournalist
                    ? 'bg-white text-[#66462C] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <span className="relative z-10">{t.primaryFeatures.users}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsJournalist(true)}
                className={clsx(
                  'relative rounded-md px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#66462C] focus:ring-offset-2',
                  isJournalist
                    ? 'bg-white text-[#66462C] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <span className="relative z-10">{t.primaryFeatures.journalists}</span>
              </button>
            </div>
          </div>
        </div>
        
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-6 pt-10 sm:gap-y-8 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-4 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-2xl px-6 py-5 transition-all duration-200 border-2',
                        selectedIndex === featureIndex
                          ? 'bg-white border-[#66462C] shadow-lg shadow-[#66462C]/10'
                          : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-md'
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-xl font-semibold data-selected:not-data-focus:outline-hidden',
                            selectedIndex === featureIndex
                              ? 'text-[#66462C]'
                              : 'text-slate-800 hover:text-slate-900'
                          )}
                        >
                          <span className="absolute inset-0 rounded-2xl" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-3 text-base leading-relaxed',
                          selectedIndex === featureIndex
                            ? 'text-slate-700'
                            : 'text-slate-600 group-hover:text-slate-700'
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 -top-26 -bottom-17 bg-gray-100 ring-1 ring-gray-200 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-slate-700 sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="relative mt-10 w-full mx-auto overflow-hidden rounded-xl bg-gray-50 shadow-xl shadow-slate-900/10 ring-1 ring-gray-200 max-w-lg sm:max-w-xl md:max-w-2xl lg:mt-0 lg:max-w-3xl xl:max-w-4xl">
                      <div className="relative aspect-[3/4] w-full max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                        <Image
                          className="object-contain"
                          src={feature.image}
                          alt=""
                          fill
                          priority
                          sizes="(min-width: 1280px) 48rem, (min-width: 1024px) 42rem, (min-width: 640px) 32rem, 28rem"
                        />
                      </div>
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  )
}
