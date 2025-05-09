package com.cinereservas.api.service.impl;

import com.cinereservas.api.dto.BaseDTO;
import com.cinereservas.api.exception.CineReservasException;
import com.cinereservas.api.model.BaseEntity;
import com.cinereservas.api.repository.BaseRepository;
import com.cinereservas.api.service.BaseService;
import org.modelmapper.ModelMapper;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseServiceImpl<E extends BaseEntity, D extends BaseDTO> implements BaseService<E, D> {

    protected final BaseRepository<E> repository;
    protected final ModelMapper modelMapper;
    private final Class<E> entityClass;
    private final Class<D> dtoClass;

    protected BaseServiceImpl(BaseRepository<E> repository, ModelMapper modelMapper,
                              Class<E> entityClass, Class<D> dtoClass) {
        this.repository = repository;
        this.modelMapper = modelMapper;
        this.entityClass = entityClass;
        this.dtoClass = dtoClass;
    }

    @Override
    @Transactional(readOnly = true)
    public D findById(Integer id) {
        E entity = repository.findByIdAndStatus(id, true)
                .orElseThrow(() -> CineReservasException.notFound("Entity not found with id: " + id));
        return mapToDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<D> findAll() {
        return repository.findAllByStatus(true).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public D save(D dto) {
        E entity = mapToEntity(dto);
        entity = repository.save(entity);
        return mapToDto(entity);
    }

    @Override
    @Transactional
    public D update(D dto) {
        if (dto.getId() == null) {
            throw CineReservasException.badRequest("ID must be provided for update operation");
        }

        repository.findByIdAndStatus(dto.getId(), true)
                .orElseThrow(() -> CineReservasException.notFound("Entity not found with id: " + dto.getId()));

        E entity = mapToEntity(dto);
        entity = repository.save(entity);
        return mapToDto(entity);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        E entity = repository.findByIdAndStatus(id, true)
                .orElseThrow(() -> CineReservasException.notFound("Entity not found with id: " + id));
        repository.delete(entity);
    }

    @Override
    @Transactional
    public void softDelete(Integer id) {
        E entity = repository.findByIdAndStatus(id, true)
                .orElseThrow(() -> CineReservasException.notFound("Entity not found with id: " + id));
        entity.setStatus(false);
        repository.save(entity);
    }

    protected E mapToEntity(D dto) {
        return modelMapper.map(dto, entityClass);
    }

    protected D mapToDto(E entity) {
        return modelMapper.map(entity, dtoClass);
    }
}