---
title: First on Debian
description: You bought a Debian server, now what?
published: 2020-03-31
category: tech
type: public
---

## Change root password

```bash
$ passwd root
```

## Add another user

This will be the user you'll be using to manage the server. So to not fuck it up as root.

```bash
$ adduser <USER>
```

```bash
$ usermod -a -G sudo <USER>
```

And then to change to the \<USER\> user

```bash
$ su owner
```

## Add ssh login with the new user

From your personal computer terminal:

```bash
$ ssh-copy-id -i ~/.ssh/id_rsa.pub root@HOSTNAME
```

Or another alternative, from the server itself, copy & paste the public key into `/home/<USER>/authorized_keys`.

After this you can try to logout of the server and login with the new user.

### Login with the new user

From your computer

```bash
$ ssh <USER>@<HOST>
```

### Improve your ssh login

From your computer.

If you don't want to type your passphrase every time, try doing

```bash
$ ssh-add
```

That will add your private key into the shh agent so you don't have to type it again.

Then, if you don't even want to type the user and host, you can modify your `.ssh/config` with this info (replacing with your data).

```
Host <CONFIG_NAME>
  Hostname <HOST>
  User <USER>
  PubkeyAcceptedKeyTypes +ssh-rsa
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/id_rsa
```

And after that you can login with just typing

```bash
$ ssh <CONFIG_NAME>
```

*And voilà* 🎩

## Make ssh login more secure

**Once you’ve added the new user and tried that the login worked**, open the file `/etc/ssh/sshd_config` with an editor and change these options.

- `PermitRootLogin` -> `no`.
- `UsePAM` -> `no`.
- `PasswordAuthentication` -> `no`
- `PermitEmptyPasswords` -> `no`
- `Port` -> some other port. Remember the port you choosed.

And now restart the ssh server:

```bash
$ service ssh restart
```

If `service` doesn't exist, then try

```bash
$ sudo systemctl restart ssh.service
```

If you had added a Host into `.ssh/config` you can add a field `PORT` with the respective port as a value.

## Config packages to download

### Get config

Go to [debgen.simplylinux.ch](https://debgen.simplylinux.ch/) and fill the options as you prefer.

### Add the config

Paste the config you've got onto `/etc/apt/sources.list`.

## Update and upgrade your packages

```bash
$ sudo apt-get update
```

```bash
$ sudo apt-get upgrade
```

## Install fail2ban

This package will look if a client fails to login several times, if that happens, it will ban the client for some time.

```bash
$ apt-get install fail2ban
```

You can change its settings in `/etc/fail2ban/fail2ban.conf`.

## Config firewall rules

[This post](https://www.tecmint.com/setup-ufw-firewall-on-ubuntu-and-debian/) covers very well how to setup `ufw` (Uncomplicated Firewall).

## Install rsync

To update a group of files is faster to use `rsync` instead of using `scp`.

[This post](https://linuxconfig.org/how-to-setup-the-rsync-daemon-on-linux) covers this subject very well.

