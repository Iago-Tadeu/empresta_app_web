<template>
  <div class="home">
    <loanForm />
  </div>
</template>

<script>
import loanForm from "@/components/loanForm.vue";

export default {
  name: "HomeView",
  components: {
    loanForm,
  },
};
</script>
