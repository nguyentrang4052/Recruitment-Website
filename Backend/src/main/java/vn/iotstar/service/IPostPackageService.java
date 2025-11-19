package vn.iotstar.service;

import java.util.List;

import vn.iotstar.dto.PostPackageDTO;

public interface IPostPackageService {
    List<PostPackageDTO> getAllPackages();
    
    PostPackageDTO getPackageById(Integer id);
    
    PostPackageDTO createPackage(PostPackageDTO dto);
    
    PostPackageDTO updatePackage(Integer id, PostPackageDTO dto);
    
    void deletePackage(Integer id);
    
    boolean toggleHidden(Integer id);
}
