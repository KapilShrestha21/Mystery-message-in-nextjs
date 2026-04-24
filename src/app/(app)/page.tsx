'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/messages.json"
// Using Lucide icons, but styled with warm colors
import { Mail, ShieldCheck } from "lucide-react" 

const Home = () => {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-[#FDF6E3] text-[#5C4033] min-h-[80vh]'>
      {/* Hero Section with refined, warm typography */}
      <section className='text-center mb-12 md:mb-16'>
        {/* Deep, terracotta/copper gradient */}
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-[#8B4513] to-[#CD853F]'>
          Dive into the World of <br className="hidden md:block" /> Anonymous Conversations
        </h1>
        <p className='mt-4 md:mt-6 text-lg md:text-xl text-[#8B7355] max-w-2xl mx-auto'>
          Explore Mystery Message — A safe space where your identity is preserved and your words matter.
        </p>
      </section>

      {/* Carousel with enhanced 'warm glass' styling */}
      <Carousel
        plugins={[Autoplay({ delay: 3500 })]} // Slightly slower, more relaxed
        className="w-full max-w-xs md:max-w-md"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index} className="md:basis-full">
              <div className="p-2">
                {/* Acrylic/Cream card with amber shadow */}
                <Card className="bg-white/70 border-[#E3DCC8] backdrop-blur-md shadow-[0_8px_30px_rgb(210,180,140,0.3)] rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-[#CD853F] flex items-center gap-2">
                      {/* Icon styled as a warm wax seal */}
                      <div className="p-1.5 bg-[#F5DEB3] rounded-full border border-[#D2B48C]">
                        <Mail className="w-3.5 h-3.5 text-[#A0522D]" />
                      </div>
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col aspect-[4/3] items-start justify-center p-6">
                    <blockquote className="italic text-lg md:text-xl text-[#5C4033]">
                      "{message.content}"
                    </blockquote>
                    <p className="text-xs text-[#A0886F] mt-4 flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" /> Verified Secure
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Adjusted controls with warmer, brass tones */}
        <div className="hidden md:block">
            <CarouselPrevious className="border-[#D2B48C] hover:bg-[#F5DEB3] text-[#A0522D] bg-white/50" />
            <CarouselNext className="border-[#D2B48C] hover:bg-[#F5DEB3] text-[#A0522D] bg-white/50" />
        </div>
      </Carousel>

      {/* Footer hint with softer warm tone */}
      <footer className="mt-16 text-[#A0886F] text-sm flex items-center gap-2">
         A trusted platform for private dialogue.
      </footer>
    </main>
  )
}

export default Home