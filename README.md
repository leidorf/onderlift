# Robot Web Arayüz Uygulaması

Önder Lift'teki yazılım mühendisliği stajımda gerçekleştirdiğim NextJS, MySQL ve ROS (Robot Operating System) iletişimiyle oluşan proje. Bu proje, ROS ve Next.js kullanarak robotlara görev atama, robotlara ait bilgileri ve harita üzerinde konumlarını görüntüleme işlevlerini içermektedir. Robotun gitmesi gereken noktalar belirlenip, robotun hedefi olarak atanır.

## Proje Yapısı

- **Next.js:** Web arayüzünü oluşturmak için kullanılan React tabanlı framework.
- **MySQL:** Robota ait bilgilerin depolanması için kullanılan ilişkisel veritabanı.
- **ROS:** Robot Operating System, robotların yazılım geliştirme çerçevesi.
- **ROSLIB.js:** ROS ile WebSocket üzerinden iletişim kurmak için kullanılan JavaScript kütüphanesi.

## Kurulum ve Başlatma

### Adımlar

1. Depoyu Klonlayın:

```
git clone https://github.com/leidorf/onderlift
cd onderlift
```

2. Gerekli Paketleri Yükleyin:

```
npm install
```

3. ROSLIB.js'i Yükleyin:

```
npm install roslib
```
4. ROS ve rosbridge_server'ı Başlatın:

```
roscore
roslaunch rosbridge_server rosbridge_websocket.launch
```

5. Gerekli Konfigürasyonları Gerçekleştirin.
<br/>

6. Uygulamayı Başlatın:
```
npm run dev
```

## Kullanım

- Robot Bilgilerini Görüntüleme:
  
  Robota ait konum, açı bilgilerini ve bağlantı durumunuekranda görüntüleyebilirsiniz.
  
- Harita Görüntüleme:

  Harita üzerinde robotun konumunu ve fare ile seçilen noktaların konumlarını görebilirsiniz.

- Nokta Ekleme:

  "Nokta Ekleme Modu"nu etkinleştirerek harita üzerine yeni noktalar ekleyebilirsiniz.
  
