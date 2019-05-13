const temp=`
<template>
<div class="page">
</div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
@Component
export default class Page extends Vue {
}
</script>
<style lang="scss" scoped>
.page {

}
</style>

`
module.exports = temp;