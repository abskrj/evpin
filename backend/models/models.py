from pydantic import BaseModel, Field, ConfigDict

from typing import Optional, Annotated, List

from pydantic import EmailStr, BeforeValidator

from bson import ObjectId

PyObjectId = Annotated[str, BeforeValidator(str)]

class ContactDetails(BaseModel):
    name: str = Field()
    email: EmailStr = Field()
    phone: str = Field()

class ChargingSlotDetails(BaseModel):
    label: str = Field()
    value: str = Field()

class Location(BaseModel):
    type: str = Field(default="Point")
    coordinates: List[float] = Field()

class EVChargerBase(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str = Field()
    location: Location = Field()

class EVChargerPublic(EVChargerBase):
    description: Optional[str] = Field(default=None)
    locality: Optional[str] = Field(default=None)
    city: str = Field()
    address: Optional[str] = Field(default=None)
    price: Optional[float] = Field(default=0)
    contact_details: Optional[ContactDetails] = Field(default=None)
    brand_list: Optional[List[str]] = Field(default=None)
    closing_time: Optional[str] = Field(default=None)
    opening_time: Optional[str] = Field(default=None)
    rating: Optional[float] = Field(default=None)
    is_open: Optional[bool] = Field(default=None)
    pin_image_url: Optional[str] = Field(default=None)
    charging_slot_details: Optional[List[ChargingSlotDetails]] = Field(default=None)
    

class EVChargerCreate(EVChargerPublic):
    source: str = Field()
    source_station_id: Optional[str] = Field(default=None)

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

class EVChargerStripped(EVChargerBase):
    ...

class EVChargerStrippedList(BaseModel):
    data: List[EVChargerStripped] = Field(default=[])