application_ids = ['io.github.gtkChess']
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