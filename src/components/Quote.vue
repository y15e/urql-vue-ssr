<script>
import { defineComponent } from 'vue'
import { useQuery } from '@urql/vue'

export default defineComponent({
  
  async setup () {
    
    const result = await useQuery({
      query: `query { randomQuote { id quote } }`
    })
    
    return {
      result: result.data
    }
  }
})
</script>

<template>
  <div>
    <pre>{{ JSON.stringify(result, null, 2) }}</pre>
  </div>
</template>
