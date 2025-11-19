package vn.iotstar.service;

import vn.iotstar.entity.NoticeHistory;

public interface INoticeHistoryService {

	<S extends NoticeHistory> S save(S entity);

}
