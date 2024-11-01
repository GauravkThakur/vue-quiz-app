<template>
  <div v-bind="$attrs">
    <pre>
      <code ref="quizSyntaxHighlighter">
        <slot />
      </code>
    </pre>
  </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import { onMounted, ref } from 'vue';
import { html as beautifyHtml, js as beautifyJs, css as beautifyCss } from 'js-beautify';

import 'highlight.js/styles/default.css'; // Import the Highlight.js CSS theme

const quizSyntaxHighlighter = ref<HTMLElement | null>(null);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);

const props = defineProps({
  language: {
    type: String,
    required: true
  }
});

function escapeHtml(html: string): string {
  return html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


onMounted(async () => {
  if (quizSyntaxHighlighter.value) {
    const code = quizSyntaxHighlighter.value.innerText;
    let formattedCode = code;

    if (props.language === 'html') {
      formattedCode = beautifyHtml(code);
    } else if (props.language === 'javascript') {
      formattedCode = beautifyJs(code);
    } else if (props.language === 'css') {
      formattedCode = beautifyCss(code);
    }

    quizSyntaxHighlighter.value.innerHTML = escapeHtml(formattedCode);
    hljs.highlightElement(quizSyntaxHighlighter.value as HTMLElement);
  }
});
</script>

<style scoped></style>
