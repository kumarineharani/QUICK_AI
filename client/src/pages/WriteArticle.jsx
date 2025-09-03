import { Sparkle } from 'lucide-react'
import React from 'react'

const WriteArticle = () => {
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkle className='w-6 text-[#4A7AFF]' />
          <h2 className='text-xl font-semibold'>Article Configuration</h2>
        </div>
      </form>

      {/* right col */}
      <div>
        {/* future content */}
      </div>
    </div>
  )
}

export default WriteArticle
