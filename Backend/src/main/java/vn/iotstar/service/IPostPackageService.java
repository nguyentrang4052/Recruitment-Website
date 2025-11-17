package vn.iotstar.service;

import java.util.List;

import vn.iotstar.dto.PostPackageDTO;

public interface IPostPackageService {
    List<PostPackageDTO> getAllPackages();
    
    PostPackageDTO getPackageById(Integer id);
}
