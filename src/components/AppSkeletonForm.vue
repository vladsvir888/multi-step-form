<template>
  <div class="skeleton">
    <div class="skeleton__nav">
      <Skeleton width="160px" height="34px"></Skeleton>
      <Skeleton width="80px" height="34px"></Skeleton>
      <Skeleton width="200px" height="34px"></Skeleton>
    </div>
    <Skeleton class="skeleton__title" width="173px" height="28px"></Skeleton>
    <div class="skeleton__fields">
      <div class="skeleton__field">
        <Skeleton class="skeleton__field-label" width="80px" height="19px"></Skeleton>
        <Skeleton width="100%" height="50px"></Skeleton>
      </div>
      <div class="skeleton__field">
        <Skeleton class="skeleton__field-label" width="40px" height="19px"></Skeleton>
        <Skeleton width="100%" height="50px"></Skeleton>
      </div>
      <div class="skeleton__field">
        <Skeleton class="skeleton__field-label" width="80px" height="19px"></Skeleton>
        <Skeleton width="100%" height="50px"></Skeleton>
      </div>
      <div class="skeleton__field">
        <Skeleton class="skeleton__field-label" width="140px" height="19px"></Skeleton>
        <Skeleton width="100%" height="50px"></Skeleton>
      </div>
      <div class="skeleton__field">
        <Skeleton class="skeleton__field-label" width="220px" height="19px"></Skeleton>
        <Skeleton width="100%" height="50px"></Skeleton>
      </div>
    </div>
    <Skeleton class="skeleton__button" width="191px" height="50px"></Skeleton>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton'
</script>

<style>
.skeleton {
  .skeleton__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 36px;
    margin-bottom: 40px;
  }

  .skeleton__title {
    margin-bottom: 20px;
  }

  .skeleton__fields {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }

  .skeleton__field-label {
    margin-bottom: 12px;
  }

  .skeleton__button {
    margin-top: 40px;
    margin-left: auto;
  }
}
</style>
