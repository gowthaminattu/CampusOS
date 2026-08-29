package com.campusos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "labs")
public class Lab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String location;

    private Integer capacity = 30;

    @Column(length = 1000)
    private String equipment;

    @Column(name = "is_restricted")
    private Boolean isRestricted = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Lab() {}

    public Lab(String name, String location, Integer capacity, String equipment, Boolean isRestricted, Boolean isActive) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.equipment = equipment;
        this.isRestricted = isRestricted;
        this.isActive = isActive;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getEquipment() { return equipment; }
    public void setEquipment(String equipment) { this.equipment = equipment; }

    public Boolean getIsRestricted() { return isRestricted; }
    public void setIsRestricted(Boolean isRestricted) { this.isRestricted = isRestricted; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
