import Image from 'next/image'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative overflow-hidden bg-[#F6F3EF] py-32"
    >
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Ready to contribute?
          </h2>
          <p className="mt-6 text-lg tracking-tight text-slate-600">
            Join the Sikiya community and start sharing your stories, articles, and insights about Africa. Download our mobile app to get started.
          </p>
          <Button href="/contribute" color="blue" className="mt-10 bg-[#66462C] hover:bg-[#563B25]">
            Download Sikiya
          </Button>
        </div>
      </Container>
    </section>
  )
}
