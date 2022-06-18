<template>
  <div class="html-body">
    <iframe
      v-if="getHtml"
      ref="ifrm"
      :srcdoc="getHtml"
      frameborder="0"
      @load="setStyles()"
    />

    <!-- Alert -->
    <BaseAlert
      v-else
      class="yellow m2 flex asfs"
      :text="$t('AlertNothingFound')"
    />
  </div>
</template>

<script>
import base64 from 'base-64'
import utf8 from 'utf8'

export default {
  name: 'ProcessingHtmlBody',

  props: {
    host: {
      type: String,
      default: ''
    },
    htmlBody: {
      type: String,
      default: ''
    }
  },

  computed: {
    getHtml () {
      const html = this.htmlBody
      if (!html) {
        return ''
      }

      const bytes = base64.decode(html)
      const text = utf8.decode(bytes)

      return text
    }
  },

  methods: {
    setStyles () {
      const iframe = this.$refs.ifrm
      const innerDoc = iframe.contentDocument || iframe.contentWindow.document
      const links = innerDoc.head.querySelectorAll('link')
      const imgs = innerDoc.body.querySelectorAll('img')

      for (let i = 0; i < links.length; i++) {
        const el = links[i]
        const currentLink = 'http://' + this.host + el.getAttribute('href')
        el.setAttribute('href', currentLink)
      }

      for (let i = 0; i < imgs.length; i++) {
        const el = imgs[i]
        const currentLink = 'http://' + this.host + el.getAttribute('src')
        el.setAttribute('src', currentLink)
      }

      this.isLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
.html-body {
  display: grid;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
