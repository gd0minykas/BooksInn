<script setup lang="ts">
import FacebookLogo from "@/components/logos/FacebookLogo.vue";
import GoogleLogo from "@/components/logos/GoogleLogo.vue";
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col align-self-start">
        <h1 class="fs-1">BooksInn</h1>
        <h2>Register as a new user</h2>
      </div>
      <div class="col">
        <form>
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Repeat Password:</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div class="mb-3 d-flex flex-row-reverse">
            <button type="button" class="ms-5 btn btn-warning">Register</button>
            <a href="#"><FacebookLogo class="mx-3" /></a>
            <a href="#"><GoogleLogo class="me-3" /></a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
