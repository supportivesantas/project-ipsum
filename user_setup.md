# Configuring Your DigitalOcean App for [ourApp] #

## Hooking up your DO account is easy ##

* note: it easiest for us (and you!) if you only run one app per server.  

1. Configure and set up your load balancer using [these instructions](https://www.digitalocean.com/community/tutorials/how-to-use-haproxy-to-set-up-http-load-balancing-on-an-ubuntu-vps) if you haven't already
    1. In your haproxy.cfg file, configure a second set credentials us to use (e.g. 'stats auth Another_User:passwd', as seen in the tutorial). Save this info to your app credentials in the dashboard.

2. Generate a new read-write access token using [these instructions]() for each DigitalOcean account you woud like to manage
    2. Be sure to save this somewhere, as it will only be displayed to you once
    2. Save this token to you app credentials in the dashboard

3. Save a snapshot of your application for us to spin up. DigitalOcean automatically backs up your droplets once a week (or more if you have paid for the service). [appname] will automatically choose the most recent image/backup to use when spinning up a new server for your app, or you can select one in your dashboard.

4. Set your app preferences in the dashboard and activate our service. Profit.