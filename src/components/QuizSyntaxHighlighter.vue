<template>
  <div ref="quizSyntaxHighlighter" v-bind="$attrs">
    <pre>
      <code>
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
import 'highlight.js/styles/default.css'; // Import the Highlight.js CSS theme

const quizSyntaxHighlighter = ref<HTMLElement | null>(null);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);

onMounted(() => {
  if (quizSyntaxHighlighter.value) {
    hljs.highlightElement(quizSyntaxHighlighter.value);
  }
});
</script>

<style scoped></style>
