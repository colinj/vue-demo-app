<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";
import CcSelect from "./CcSelect.vue";
import { onMounted, ref } from "vue";
import CcList from "./CcList.vue";
import CcTooltip from "./CcTooltip.vue";

const names = ref(["Tom", "Jane", "Peter", "Mary", "Jordan", "Polly", "Amanda", "Billy"]);
const name = ref("");

type ItemType = {
  name: string;
  height: number;
  size: string;
  id: number;
};

const manyItems = ref<ItemType[]>(
  Array.from(Array(9999).keys()).map((i) => ({
    name: `Item ${i}`,
    height: i % 2 === 0 ? 42 : 84,
    size: i % 2 === 0 ? "small" : "large",
    id: i,
  }))
);

const item = ref<ItemType>();

const containerRef = ref<Element | null>(null);

onMounted(() => {
  containerRef.value = document.getElementsByClassName("app-layout__content")[0];
});
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Vue’s
    <a target="_blank" href="https://vuejs.org/">official documentation</a>
    provides you with all information you need to get started.
  </WelcomeItem>

  <div>
    Howdy
    <CcTooltip pos="top">
      <template #target>Target</template>
      <span>The lengthy tooltip description is extra long so it can talk about this item</span>
    </CcTooltip>
    word in
    <CcTooltip
      pos="bottom"
      text="Ipsum lorem More lengthy tooltip description for the word 'this' is extra long so it can talk about this item"
    >
      <template #target>this</template>
    </CcTooltip>
    sentence
  </div>

  <div class="mt-10">
    Howdy
    <CcTooltip pos="top" hover>
      <template #target>Target</template>
      <span>The lengthy tooltip description is extra long so it can talk about this item</span>
    </CcTooltip>
    word in
    <CcTooltip
      pos="bottom"
      hover
      text="Ipsum lorem More lengthy tooltip description for the word 'this' is extra long so it can talk about this item"
    >
      <template #target>this</template>
    </CcTooltip>
    sentence
  </div>

  <WelcomeItem>
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Tooling</template>

    This project is served and bundled with
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite</a>
    . The recommended IDE setup is
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    . If you need to test your components and web pages, check out
    <a href="https://www.cypress.io/" target="_blank">Cypress</a>
    and
    <a href="https://on.cypress.io/component" target="_blank">Cypress Component Testing</a>
    .

    <br />

    More instructions are available in
    <code>README.md</code>
    .
  </WelcomeItem>

  <CcList v-model="item" :items="manyItems" :max-height="307" item-key="id" v-slot="{ item: thing }">
    {{ thing.name }}
  </CcList>

  <WelcomeItem>
    <template #icon>
      <EcosystemIcon />
    </template>
    <template #heading>Ecosystem</template>

    Get official tools and libraries for your project:
    <a target="_blank" href="https://pinia.vuejs.org/">Pinia</a>
    ,
    <a target="_blank" href="https://router.vuejs.org/">Vue Router</a>
    ,
    <a target="_blank" href="https://test-utils.vuejs.org/">Vue Test Utils</a>
    , and
    <a target="_blank" href="https://github.com/vuejs/devtools">Vue Dev Tools</a>
    . If you need more resources, we suggest paying
    <a target="_blank" href="https://github.com/vuejs/awesome-vue">Awesome Vue</a>
    a visit.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <CommunityIcon />
    </template>
    <template #heading>Community</template>

    Got stuck? Ask your question on
    <a target="_blank" href="https://chat.vuejs.org">Vue Land</a>
    , our official Discord server, or
    <a target="_blank" href="https://stackoverflow.com/questions/tagged/vue.js">StackOverflow</a>
    . You should also subscribe to
    <a target="_blank" href="https://news.vuejs.org">our mailing list</a>
    and follow the official
    <a target="_blank" href="https://twitter.com/vuejs">@vuejs</a>
    twitter account for latest news in the Vue world.
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <div>{{ name }}</div>
  <CcSelect v-model="name" :options="names" allow-empty :anchor="containerRef" />

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <SupportIcon />
    </template>
    <template #heading>Support Vue</template>

    As an independent project, Vue relies on community backing for its sustainability. You can help us by
    <a target="_blank" href="https://vuejs.org/sponsor/">becoming a sponsor</a>
    .
  </WelcomeItem>
</template>
