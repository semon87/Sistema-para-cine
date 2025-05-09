package com.cinereservas.api.repository;

import com.cinereservas.api.model.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity> extends JpaRepository<T, Integer> {

    List<T> findAllByStatus(Boolean status);

    Optional<T> findByIdAndStatus(Integer id, Boolean status);
}