package vn.iotstar.service;

public interface IEmployerSettingService {
    String getCurrentEmail(Integer accountId);
    void updatePassword(Integer accountId, String oldPass, String newPassword);
    void updateEmail(Integer accountId, String newEmail);
}
