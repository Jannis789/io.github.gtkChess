application_ids = ['io.github.gtkChess',   'black_pawn',
  'black_rook',
  'black_knight',
  'black_bishop',
  'black_queen',
  'black_king',
  'white_pawn',
  'white_rook',
  'white_knight',
  'white_bishop',
  'white_queen',
  'white_king']
application_id = 'io.github.gtkChess'

symbolic_dir = join_paths('hicolor', 'symbolic', 'apps')
install_data(
  join_paths(symbolic_dir, ('@0@-symbolic.svg').format(application_id)),
  install_dir: join_paths(get_option('datadir'), 'icons', symbolic_dir)
)

foreach application_id : application_ids
scalable_dir = join_paths('hicolor', 'scalable', 'apps')
install_data(
  join_paths(scalable_dir, ('@0@.svg').format(application_id)),
  install_dir: join_paths(get_option('datadir'), 'icons', scalable_dir)
)
endforeach