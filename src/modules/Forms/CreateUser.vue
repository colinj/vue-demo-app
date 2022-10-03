<script setup lang="ts">
import { ref, toRefs } from "vue";
import { z } from "zod";
import { useZodSchema } from "@/composables/useZodSchema";
import CcInput from "@/components/CcInput.vue";
import CcButton from "@/components/CcButton.vue";
import CcField from "@/components/CcField.vue";
import CcCheckbox from "@/components/CcCheckbox.vue";
import ShowDebug from "./ShowDebug.vue";

enum UserRole {
  Admin = "admin",
  User = "user",
}

const formSchema = z
  .object({
    name: z.string().min(5),
    age: z.number().min(18).max(100),
    email: z.string().min(1).email(),
    password: z.string().min(8),
    confirm: z.string().min(1),
    roles: z.array(z.nativeEnum(UserRole)).min(1, { message: "You must select at least 1 role" }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

const form = useZodSchema(formSchema, { initialValues: { name: "", roles: [] } });
const { fields, useField, handleSubmit, isSubmitting, errors, dirty, values } = form;

const { name, age } = toRefs(fields);
const email = useField("email");
const password = useField("password");
const confirm = useField("confirm");
const roles = useField("roles");

const onSubmit = handleSubmit(async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  alert(JSON.stringify(data, null, 2));
});

const showDebug = ref(false);
</script>

<template>
  <div class="p-10">
    <h1>Create User</h1>
    <CcCheckbox v-model="showDebug">Show Debug Info</CcCheckbox>
    <div class="flex-container">
      <form class="create-user mt-6" @submit="onSubmit">
        <CcField label="Name" :error="errors.name" required>
          <CcInput v-model="name" />
        </CcField>

        <CcField label="Email" :error="email.error" required>
          <CcInput v-model="fields.email" type="email" @blur="email.onBlur" />
        </CcField>

        <CcField label="Age" :error="errors.age" required>
          <CcInput type="number" v-model="age" />
        </CcField>

        <CcField label="Roles" :error="errors.roles" required>
          <CcCheckbox v-model="roles.value" :options="{ admin: 'Admin', user: 'User' }" />
        </CcField>

        <CcField label="Password" :error="errors.password" required>
          <CcInput v-model="password.value" type="password" @blur="password.onBlur" />
        </CcField>

        <CcField label="Confirm Password" :error="errors.confirm" required>
          <CcInput v-model="confirm.value" type="password" @blur="confirm.onBlur" />
        </CcField>

        <CcButton class="mt-6" kind="primary" :loading="isSubmitting" type="submit">Submit</CcButton>
      </form>
      <ShowDebug v-if="showDebug" :form="{ values, dirty, errors }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  gap: 20px;

  width: 100%;

  > * {
    flex-basis: 50%;
  }
}

.create-user {
  .cc-field + .cc-field {
    margin-top: 2rem;
  }
}
</style>
