package vn.iotstar;


import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import vn.iotstar.service.imp.JobNoticeService;


@SpringBootApplication(scanBasePackages = "vn.iotstar")
@EnableScheduling
public class TlcnWebtuyendungApplication {

    public static void main(String[] args) {
        SpringApplication.run(TlcnWebtuyendungApplication.class, args);
    }
    @Autowired
    private JobNoticeService nService;
    @Service
    class TestScheduler {
    	@Scheduled(cron = "0 7 19 * * ?", zone = "Asia/Ho_Chi_Minh")
//    	@Scheduled(cron = "*/10 * * * * *")
    	public void sendDailyNotifications() {
    		nService.sendScheduledNotifications();
    	}
    }
}
