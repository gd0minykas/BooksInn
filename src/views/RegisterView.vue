<script setup lang="ts"></script>

<template>
  <div class="container">
    <div class="row">
      <div class="col align-self-start">
        <h1>BooksInn</h1>
        <h2>Register as a new user</h2>
      </div>
      <div class="col">
        <form>
          <div class="mb-2">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" class="form-control" />
          </div>
          <div class="mb-2">
            <label for="username" class="form-label">Username:</label>
            <input type="text" id="username" class="form-control" />
          </div>
          <div class="mb-5">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" class="form-control" />
          </div>
          <div class="mb-3">
            <!-- providers -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
