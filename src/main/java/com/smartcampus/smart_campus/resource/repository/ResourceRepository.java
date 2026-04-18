package com.smartcampus.smart_campus.resource.repository;

import com.smartcampus.smart_campus.common.enums.ResourceStatus;
import com.smartcampus.smart_campus.common.enums.ResourceType;
import com.smartcampus.smart_campus.resource.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocation(String location);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    @Query("SELECT r FROM Resource r WHERE " +
            "(:type IS NULL OR r.type = :type) AND " +
            "(:location IS NULL OR r.location = :location) AND " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:capacity IS NULL OR r.capacity >= :capacity)")
    List<Resource> searchResources(
            @Param("type") ResourceType type,
            @Param("location") String location,
            @Param("status") ResourceStatus status,
            @Param("capacity") Integer capacity
    );
}