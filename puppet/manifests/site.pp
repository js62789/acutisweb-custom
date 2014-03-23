group { "puppet": ensure => "present" }

Exec { path => "/usr/bin:/bin:/usr/sbin:/sbin" }

define apt::ppa (
  $ensure = "present",
  $options = "-y",
  $release = "precise",
) {

  if $ensure == "present" {
    $sources_list_d = "/etc/apt/sources.list.d"
    $filename_without_slashes = regsubst($name, '/', '-', 'G')
    $filename_without_dots    = regsubst($filename_without_slashes, '\.', '_', 'G')
    $filename_without_ppa     = regsubst($filename_without_dots, '^ppa:', '', 'G')
    $sources_list_d_filename = "${filename_without_ppa}-${release}.list"

    exec { "add-apt-repository-${name}":
      command => "add-apt-repository ${options} ${name}",
      unless => "/usr/bin/test -s ${sources_list_d}/${sources_list_d_filename}",
      require => Package["python-software-properties"],
      notify => Exec["apt_update"],
    }

    file { "${sources_list_d}/${sources_list_d_filename}":
      ensure  => file,
      require => Exec["add-apt-repository-${name}"],
    }

  } else {

    file { "${sources_list_d}/${sources_list_d_filename}":
        ensure => 'absent',
        notify => Exec['apt_update'],
    }

  }
}

exec { "apt_update":
  command => "apt-get update --fix-missing",
  refreshonly => true,
}

#
# Install Python Software Properties
# 
package { "python-software-properties": 
  ensure => present,
}

#
# Install Vim
# 
package { "vim": 
  ensure => present,
}

#
# Install Git
# 
package { "git":
  ensure => present,
}
  
# 
# Install NGINX
#
apt::ppa { "ppa:nginx/stable": 
  before => Package["nginx"],
}

package { "nginx":
  ensure => present,
}

service { "nginx":
  ensure => running,
  require => Package["nginx"],
}

file { "/var/www":
  ensure => directory,
  mode => "755",
  owner => "root",
  group => "root",
}

#
# Install Node.js
# 
apt::ppa { "ppa:chris-lea/node.js": 
  before => Package["nodejs"],
}

package { "nodejs":
  ensure => present,
}

#
# Install MySQL
# 
package { "mysql-server":
  ensure => present,
}

service { "mysql":
  ensure => running,
  require => Package["mysql-server"],
}

$mysql_user = "root"
$mysql_password = "root"
$mysql_db = "acutis"

exec { "set-mysql-password":
  unless => "mysqladmin -u${mysql_user} -p$mysql_password status",
  path => ["/bin", "/usr/bin"],
  command => "mysqladmin -u${mysql_user} password $mysql_password",
  require => Service["mysql"],
}

exec { "build_database":
  unless => "mysql -u${mysql_user} -p${mysql_password} ${mysql_db}",
  command => "mysql -u${mysql_user} -p${mysql_password} < /var/www/acutisweb/puppet/modules/mysql/files/build_database.sql",
  require => [Exec["set-mysql-password"], Exec["update_repository"]],
}

exec { "insert_data":
  command => "mysql -u${mysql_user} -p${mysql_password} < /var/www/acutisweb/puppet/modules/mysql/files/insert_data.sql",
  logoutput => true,
  require => [Exec["build_database"], Exec["update_repository"]],
}

#
# Install acutisweb Repo
#
$username = "root"
$group = $username

file { "/root/.ssh" :
  ensure => directory,
  group => $group,
  owner => $username,
  mode => 0600,
}

file { "/root/.ssh/known_hosts" :
  ensure => file,
  group => $group,
  owner => $username,
  mode => 0600,
  source => 'puppet:///modules/known_hosts/known_hosts',
  require => File[ '/root/.ssh' ],
}

exec { "clone_repository":
  command => "git clone git@github.com:js62789/acutisweb.git",
  cwd => "/var/www",
  creates => "/var/www/acutisweb",
  require => [File["/var/www"], Package["git"], File["/root/.ssh/known_hosts"]],
}

exec { "update_repository":
  command => "git checkout master && git pull",
  cwd => "/var/www/acutisweb",
  require => Exec["clone_repository"],
}

exec { "npm_install":
  command => "npm install",
  cwd => "/var/www/acutisweb",
  require => Exec["update_repository"],
}

exec { "install_grunt":
  command => "npm install -g grunt-cli",
  require => Package["nodejs"],
}

file { "/etc/nginx/sites-enabled/default":
  ensure => absent,
  require => Package["nginx"],
}

file { "/etc/nginx/sites-enabled/acutisweb.conf":
  ensure => file,
  source => "puppet:///modules/nginx/acutisweb.conf",
  require => [Package["nginx"], Exec["clone_repository"]],
  notify => Service["nginx"],
}

file { "/etc/init/acutisweb.conf":
  ensure => present,
  content => template("upstart/acutisweb.erb"),
  require => Exec["clone_repository"],
  notify => Service["acutisweb"],
}

service { "acutisweb":
  ensure => running,
  require => [Exec["npm_install"], Exec["install_grunt"]]
}
