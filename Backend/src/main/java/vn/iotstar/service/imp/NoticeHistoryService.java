package vn.iotstar.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.iotstar.entity.NoticeHistory;
import vn.iotstar.repository.INoticeHistoryRepository;
import vn.iotstar.repository.IJobNoticeRepository;
import vn.iotstar.service.INoticeHistoryService;

@Service
public class NoticeHistoryService implements INoticeHistoryService {
	@Autowired
	private INoticeHistoryRepository historyRepository;

	public <S extends NoticeHistory> S save(S entity) {
		return historyRepository.save(entity);
	}
	
	
}
