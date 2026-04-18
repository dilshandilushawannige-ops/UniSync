package com.smartcampus.resource.repository;

import com.smartcampus.common.enums.ResourceStatus;
import com.smartcampus.common.enums.ResourceType;
import com.smartcampus.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByTypeAndStatusAndCapacityGreaterThanEqual(ResourceType type, ResourceStatus status, int capacity);
}
