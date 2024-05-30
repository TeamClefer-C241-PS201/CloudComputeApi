const knex = require('knex');

exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('userId').primary();
    table.string('googleId', 255);
    table.string('name', 255);
    table.string('username',20).unique();
    table.string('email', 255).unique();
    table.string('password', 255);
    table.string('userPhoto', 255);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('comments', (table) => {
    table.increments('commentId').primary();
    table.string('postComment', 255).notNullable();
  });

  await knex.schema.createTable('posts', (table) => {
    table.increments('postId').primary();
    table.integer('userId').unsigned().notNullable();
    table.foreign('userId').references('userId').inTable('users');
    table.integer('commentId').unsigned();
    table.foreign('commentId').references('commentId').inTable('comments'); // Might be null
    table.string('postTitle', 255).notNullable();
    table.string('postDesc', 255).notNullable();
    table.string('postDate', 255).notNullable();
    table.integer('postLike').defaultTo(0);
  });
  // Articles table
  await knex.schema.createTable('articles', (table) => {
    table.increments('articleId').primary();
    table.string('articleTitle', 255).notNullable();
    table.string('articleDesc', 255).notNullable();
  });
  // Diseases table
  await knex.schema.createTable('diseases', (table) => {
    table.increments('diseaseId').primary();
    table.integer('articleId').unsigned().notNullable();
    table.foreign('articleId').references('articleId').inTable('articles');
    table.string('diseaseName', 255).notNullable();
    table.string('recommendation', 255);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('diseases');
  await knex.schema.dropTableIfExists('articles');
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('users');
};