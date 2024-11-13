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
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

onMounted(async () => {
  if (quizSyntaxHighlighter.value) {
    const code = quizSyntaxHighlighter.value.innerText;
    let formattedCode = code;
    const options = { indent_size: 2, space_in_empty_paren: true };

    if (props.language === 'html') {
      formattedCode = beautifyHtml(code);
    } else if (props.language === 'javascript') {
      formattedCode = beautifyJs(code, options);
    } else if (props.language === 'css') {
      formattedCode = beautifyCss(code);
    }

    quizSyntaxHighlighter.value.innerHTML = escapeHtml(formattedCode);
    hljs.highlightElement(quizSyntaxHighlighter.value as HTMLElement);
  }
});
</script>

<style scoped>
pre {
  display: inline-table;
  font-size: 0.85em;
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
</style>
