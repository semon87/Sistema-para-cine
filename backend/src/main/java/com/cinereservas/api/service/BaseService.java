package com.cinereservas.api.service;

import com.cinereservas.api.dto.BaseDTO;
import com.cinereservas.api.model.BaseEntity;

import java.util.List;

public interface BaseService<E extends BaseEntity, D extends BaseDTO> {

    D findById(Integer id);

    List<D> findAll();

    D save(D dto);

    D update(D dto);

    void delete(Integer id);

    void softDelete(Integer id);
}