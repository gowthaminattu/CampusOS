package com.campusos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "hostel_rooms")
public class HostelRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_number", unique = true, nullable = false)
    private String roomNumber;

    @Column(name = "room_type", nullable = false)
    private String roomType;

    private Integer floor;
    private String block;
    private String amenities;

    @Column(name = "monthly_rent")
    private Integer monthlyRent = 3000;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    public HostelRoom() {}

    public HostelRoom(String roomNumber, String roomType, Integer floor, String block, String amenities, Integer monthlyRent, Boolean isAvailable) {
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.floor = floor;
        this.block = block;
        this.amenities = amenities;
        this.monthlyRent = monthlyRent;
        this.isAvailable = isAvailable;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }

    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public Integer getMonthlyRent() { return monthlyRent; }
    public void setMonthlyRent(Integer monthlyRent) { this.monthlyRent = monthlyRent; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
