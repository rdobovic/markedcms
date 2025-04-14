# Deploying with Podman quadlets

This README will explain how to deploy application with podman and systemd.
This will be done by using podman quadlets feature.

## Create user

Switch to the user for under which you wish to configure and run application,
if you want to create a new user, you can do so using the following set of
commands, I will name my user `markedcms`.

If you decide to use some other username don't forget to change all commands
below and edit the quadlet files.

```bash
# Create new user
useradd -m -d /home/markedcms -s /bin/bash -U markedcms
# Enable user services to run when use is not logged in
loginctl enable-linger markedcms

# Create directories to store quadlet and systemd files
mkdir -p /home/markedcms/.config/systemd/user
mkdir -p /home/markedcms/.config/containers/systemd

# Create some convenient symbolic links
ln -s /home/markedcms/.config/systemd/user/ /home/markedcms/systemd
ln -s /home/markedcms/.config/containers/systemd/ /home/markedcms/quadlets

# Mariadb backups directory
mkdir -p /home/markedcms/mariadb_backups
```

Once you finish setting up the user switch new user

```bash
su - markedcms
```

## Create podman secrets

We need to create a few podman secrets that will be used as credentials
for mariadb (mysql) database. I will use openssl to generate random passwords
and usernames.

```bash
printf "markedcms_$(openssl rand -hex 8)" | podman secret create markedcms.mariadb.username -

printf "$(openssl rand -base64 32)" | podman secret create markedcms.mariadb.password -
printf "$(openssl rand -base64 32)" | podman secret create markedcms.mariadb.root_password -
```

## Configure quadlets

First you need to pull quadlet files from github, you can do so using git.

```bash
cd /home/markedcms

git clone https://github.com/rdobovic/markedcms repo
cp repo/deploy/quadlets/* quadlets

# Edit quadlets files to configure app as you need to...
# >> Don't forget to change ORIGIN env to match your doman <<
```

Now run the app using systemd

```bash
systemctl --user daemon-reload
systemctl --user start markedcms-pod
```


## Running migrations

When you pull new version of markedcms you need to run database migrations
using `migrate.sh` script. You can do so using the command below. This process 
may be automated in the future.

```bash
# Run migrations
podman exec -it systemd-markedcms.app /bin/bash /app/migrate.sh
# Restart the containers
systemctl --user restart markedcms-pod
```

## Docker images

By default quadlets are using images hosted on docker hub, feel free to build
all images yourself.


Thank you for using markedcms :)