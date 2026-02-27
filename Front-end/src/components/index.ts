export { default as Persons } from "./Persons";
export { default as Categories } from "./Categories";
export { default as Transactions } from "./Transactions";
export { default as Reports } from "./Reports";
export { default as CreateCategory } from "./CreateCategory";
export { default as CreateTransaction } from "./CreateTransaction";

// Como não exportei como function eu exportei como Default para não ficar na App import { default as Persons } from "components"; e ter que criar varios desta maneira coloquei todos em um unico arquivo index para já exportar tudo de uma vez só
