/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
  });

  pgm.sql('UPDATE comments SET is_delete = false WHERE is_delete IS NULL');
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'is_delete');
};
