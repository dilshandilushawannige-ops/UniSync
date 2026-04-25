package com.smartcampus.unisync.resource.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceCsvImportResultDto {

    private int totalRows;
    private int created;
    private int failed;

    @Builder.Default
    private List<RowError> errors = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RowError {
        private int rowNumber;
        private String message;
        private String raw;
    }
}

