sudo apt-get install redis-server
sudo apt-get install python-pip
sudo apt-get install mongodb
sudo apt install npm
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
sudo dpkg-reconfigure locales

pip install -r requirements.txt
sudo npm install pm2@latest -g
sudo apt-get install nodejs-legacy
sudo npm install nodemon -g


curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs