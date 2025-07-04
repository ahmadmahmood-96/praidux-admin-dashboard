import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  message,
  InputNumber,
  notification,
  DatePicker,
  Switch,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import client from "../../../utils/axios";
import DescriptionTitle from "../../../components/ui/DescriptionTitle";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ImageUpload from "../../../components/ui/ImageUploader";
import SubHeading from "../../../components/ui/SubHeading";
import { gearTypes } from "../../../constants/gearTypes";
import { useProgress } from "../../../context/progressContext";
import LoadingSpinner from "../../../components/ui/LoaderSpinner";

type CarMakeNameOnly = Pick<CarMake, "_id" | "name">;

const AddCar = () => {
  const progress = useProgress();
  const location = useLocation();
  const [id, setId] = useState<string | null>(null);
  const isEdit = !!id;
  const [fileList, setFileList] = useState<any[]>([]); // Use 'any' for Ant Design's UploadFile type for simplicity
  const [initialValues, setInitialValues] = useState<any>(null);
  const [form] = Form.useForm<CarFormValues>();
  const queryClient = useQueryClient();
  const selectedMake = Form.useWatch("make", form);

  const fetchAllCars = async (): Promise<CarMakeNameOnly[]> => {
    const { data } = await client.get<{
      status: string;
      result: CarMakeNameOnly[];
    }>("/config/get-makes");
    return data.result;
  };

  const {
    status: makesStatus,
    data: makes,
    isFetching: isMakesFetching,
    error: makesError,
    refetch,
  } = useQuery(["AllMakes"], fetchAllCars, {
    enabled: false,
    suspense: false,
    refetchOnWindowFocus: false,
  });

  const handleDropdownVisibleChange = (open: boolean) => {
    if (open) {
      const cachedData = queryClient.getQueryData(["AllMakes"]);

      if (!cachedData) {
        refetch(); // Only fetch if there's no cached data
      }
    }
  };

  const {
    data: models,
    refetch: refetchModels,
    isFetching: isModelsFetching,
  } = useQuery(
    ["CarModels", selectedMake],
    async () => {
      const { data } = await client.get<{ models: string[] }>(
        `/config/get-models/${selectedMake}`
      );
      return data.models;
    },
    {
      enabled: false,
      suspense: false,
      refetchOnWindowFocus: false,
      onError: () => {
        message.error("Failed to fetch car models.");
      },
    }
  );

  // Trigger fetch when make changes
  useEffect(() => {
    if (selectedMake) {
      refetchModels();
      // Only clear model field if not editing or if make actually changed
      if (!isEdit || (initialValues && selectedMake !== initialValues.make)) {
        form.setFieldsValue({ model: undefined });
      }
    }
  }, [selectedMake, isEdit, initialValues, refetchModels, form]);

  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
  }, [location.state]);

  // Fetch car details if editing
  const {
    isLoading: isCarDataLoading,
    isFetching: isCarDataFetching,
    refetch: refetchCar,
  } = useQuery(
    ["Car", id],
    async () => {
      const { data } = await client.get(`/cars/view-car/${id}`);
      return data;
    },
    {
      enabled: !!id, // only run if id is available
      onSuccess: (data: { result: any }) => {
        const car = data.result;
        setInitialValues(car);

        const formData = {
          ...car,
          manufacturing_year: car.manufacturing_year
            ? dayjs().year(car.manufacturing_year)
            : null,
        };

        form.setFieldsValue(formData);

        if (car.images && car.images.length > 0) {
          const existingImages = car.images.map(
            (url: string, index: number) => ({
              uid: `existing-${index}`,
              name: `existing-image-${index}`,
              status: "done",
              url: url,
              isExisting: true,
            })
          );
          setFileList(existingImages);
        }
      },
      onError: () => {
        message.error("Failed to fetch car details.");
      },
      refetchOnWindowFocus: false,
    }
  );

  // If location.state.id arrives later, refetch manually
  useEffect(() => {
    if (id) {
      refetchCar();
    }
  }, [id, refetchCar]);

  const fetchAllColors = async (): Promise<{ _id: string; name: string }[]> => {
    const { data } = await client.get<{
      status: string;
      result: { _id: string; name: string }[];
    }>("/color/view-colors");
    return data.result;
  };

  const {
    status: colorsStatus,
    data: colors,
    isFetching: isColorsFetching,
    error: colorsError,
    refetch: refetchColors,
  } = useQuery(["AllCarColors"], fetchAllColors, {
    enabled: false,
    suspense: false,
    refetchOnWindowFocus: false,
  });

  const handleColorDropdownVisibleChange = (open: boolean) => {
    if (open) {
      const cachedData = queryClient.getQueryData(["AllCarColors"]); // Corrected cache key
      if (!cachedData) {
        refetchColors();
      }
    }
  };

  // Function to get only changed values
  const getChangedValues = (currentValues: any, originalValues: any) => {
    const changes: any = {};

    Object.keys(currentValues).forEach((key) => {
      if (key === "manufacturing_year") {
        // Handle year comparison
        const currentYear = currentValues[key]
          ? dayjs(currentValues[key]).year()
          : null;
        const originalYear = originalValues[key] || null;
        if (currentYear !== originalYear) {
          changes[key] = currentYear;
        }
      } else if (
        Array.isArray(currentValues[key]) &&
        Array.isArray(originalValues[key])
      ) {
        // Handle array comparison (like interior_color)
        // Sort arrays before stringifying to ensure order doesn't matter
        const currentArray = [...currentValues[key]].sort();
        const originalArray = [...originalValues[key]].sort();
        if (JSON.stringify(currentArray) !== JSON.stringify(originalArray)) {
          changes[key] = currentValues[key];
        }
      } else if (currentValues[key] !== originalValues[key]) {
        changes[key] = currentValues[key];
      }
    });

    return changes;
  };

  const { mutate: submitCar, isLoading } = useMutation(
    async (values: CarFormValues) => {
      const formData = new FormData();
      let dataToSend: any = {};

      if (isEdit && initialValues) {
        const changedFields = getChangedValues(values, initialValues);
        // Special handling for manufacturing_year to ensure it's a number
        if (changedFields.manufacturing_year) {
          changedFields.manufacturing_year = dayjs(
            changedFields.manufacturing_year
          ).year();
        }
        dataToSend = changedFields;

        // Determine if images have changed
        const newImages = fileList.filter((file: any) => !file.isExisting);
        const currentExistingImageUrls = fileList
          .filter((file: any) => file.isExisting)
          .map((file: any) => file.url)
          .sort();
        const initialExistingImageUrls = (initialValues.images || []).sort();

        const imagesChanged =
          newImages.length > 0 ||
          JSON.stringify(currentExistingImageUrls) !==
            JSON.stringify(initialExistingImageUrls);

        if (imagesChanged) {
          // If images changed, send all current images (new and existing)
          const allImagesToSend = fileList;
          const filesToUpload = allImagesToSend.filter(
            (file: any) => !file.isExisting
          );
          const existingImageUrls = allImagesToSend
            .filter((file: any) => file.isExisting)
            .map((file: any) => file.url);

          existingImageUrls.forEach((url: string) => {
            formData.append("existingImages[]", url);
          });

          filesToUpload.forEach((file: any) => {
            const actualFile = file.originFileObj;
            if (actualFile instanceof File) {
              formData.append("images", actualFile);
            }
          });
          formData.append("imagesChanged", "true");
        } else {
          formData.append("imagesChanged", "false");
        }
      } else {
        // For new car, send all values and all images
        dataToSend = {
          ...values,
          manufacturing_year: values.manufacturing_year
            ? dayjs(values.manufacturing_year).year()
            : null,
        };
        fileList.forEach((file: any) => {
          const actualFile = file.originFileObj;
          if (actualFile instanceof File) {
            formData.append("images", actualFile);
          }
        });
      }

      // Append data fields to FormData (only changed fields for edit, all for add)
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => formData.append(`${key}[]`, String(v)));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      progress.startProgress();

      const endpoint = isEdit ? `/cars/update-car/${id}` : "/cars/add-car";
      const method = isEdit ? "put" : "post";

      return client[method](endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          let percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          if (percent >= 100) percent = 80; // simulate slower completion
          progress.updateProgress(percent);
        },
      });
    },
    {
      onSuccess: () => {
        progress.completeProgress(
          isEdit ? "Car updated successfully" : "Car added successfully"
        );
        queryClient.invalidateQueries(["Cars"]);
        if (!isEdit) {
          form.resetFields();
          setFileList([]);
        }
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "add"} car details.`;
        progress.errorProgress(msg);
      },
    }
  );

  const onFinish = (values: CarFormValues) => {
    // For new cars, require at least one image
    if (!isEdit && fileList.length === 0) {
      notification.error({
        message: "Please upload car images",
      });
      return;
    }

    submitCar(values); // Pass the raw form values to the mutation
  };

  if (makesError) message.error("Error fetching car makes");
  if (colorsError) message.error("Error fetching car colors");

  return (
    <>
      <LoadingSpinner
        isLoading={isEdit ? isCarDataFetching || isCarDataLoading : false}
      />
      <DescriptionTitle
        title={isEdit ? "Edit Car" : "Add Car"}
        description="Fill the form below to add or edit car details"
      />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError={{ behavior: "smooth", block: "center" }}
      >
        <Row gutter={16}>
          {/* ==== Basic Info ==== */}
          <Col span={24}>
            <SubHeading title="Basic Information" />
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter car title" }]}
            >
              <Input size="large" placeholder="e.g. 2018 Hyundai Elantra SE" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Make"
              name="make"
              rules={[
                { required: true, message: "Please select the car make" },
              ]}
            >
              <Select
                onDropdownVisibleChange={handleDropdownVisibleChange}
                size="large"
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label as string)
                    .toLowerCase()
                    .localeCompare((optionB?.label as string).toLowerCase())
                }
                placeholder="Select Make"
                loading={isMakesFetching || makesStatus === "loading"}
                options={makes?.map((make: CarMakeNameOnly) => ({
                  value: make.name,
                  label: make.name,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Model"
              name="model"
              rules={[
                { required: true, message: "Please enter the car model" },
              ]}
            >
              <Select
                size="large"
                placeholder="Select Model"
                loading={isModelsFetching}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label as string)
                    .toLowerCase()
                    .localeCompare((optionB?.label as string).toLowerCase())
                }
                options={
                  models
                    ? models.map((model) => ({
                        label: model,
                        value: model,
                      }))
                    : []
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Manufacturing Year"
              name="manufacturing_year"
              rules={[
                { required: true, message: "Please select manufacturing year" },
              ]}
            >
              <DatePicker
                picker="year"
                size="large"
                style={{ width: "100%" }}
                placeholder="Select Year"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Condition"
              name="condition"
              rules={[{ required: true, message: "Please select condition" }]}
            >
              <Select
                size="large"
                placeholder="Select Condition"
                options={[
                  { label: "New", value: "new" },
                  { label: "Used", value: "used" },
                  { label: "Accident", value: "accident" },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Body Type"
              name="body_type"
              rules={[{ required: true, message: "Please select body type" }]}
            >
              <Select
                size="large"
                placeholder="Select Body Type"
                options={[
                  "Sedan",
                  "Coupe",
                  "SUV",
                  "Truck",
                  "Hatchback",
                  "Minivan",
                ].map((type) => ({ label: type, value: type }))}
              />
            </Form.Item>
          </Col>

          {/* ==== Technical Specs ==== */}
          <Col span={24}>
            <SubHeading title="Technical Specifications" />
          </Col>

          {[
            ["Engine Capacity", "engine", "e.g. 2.0L I4 Gas"],
            ["Cylinders", "cylinders", "e.g. 4"],
            ["Doors", "doors", "e.g. 4"],
            ["Horsepower", "horsepower", "e.g. 147"],
          ].map(([label, name, placeholder]) => (
            <Col xs={24} sm={12} md={12} lg={8} key={name}>
              <Form.Item label={label} name={name}>
                <Input size="large" placeholder={placeholder} />
              </Form.Item>
            </Col>
          ))}

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Fuel Type"
              name="fuel_type"
              rules={[{ required: true, message: "Please select fuel type" }]}
            >
              <Select
                size="large"
                placeholder="Select Fuel Type"
                options={[
                  "Petrol",
                  "Diesel",
                  "Electric",
                  "Hybrid",
                  "LPG",
                  "CNG",
                ].map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Gear Type"
              name="gear_type"
              rules={[{ required: true, message: "Please select gear type" }]}
            >
              <Select
                size="large"
                placeholder="Select Gear Type"
                options={gearTypes.map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Drive Train" name="drive_train">
              <Select
                size="large"
                placeholder="Select Drive Train"
                options={[
                  "FWD (Front-Wheel Drive)",
                  "RWD (Rear-Wheel Drive)",
                  "AWD (All-Wheel Drive)",
                  "4WD (Four-Wheel Drive)",
                ].map((type) => ({
                  label: type,
                  value: type,
                }))}
              />
            </Form.Item>
          </Col>

          {/* ==== Appearance ==== */}
          <Col span={24}>
            <SubHeading title="Appearance" />
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Exterior Color" name="exterior_color">
              <Select
                size="large"
                placeholder="Select Exterior Color"
                onDropdownVisibleChange={handleColorDropdownVisibleChange}
                loading={isColorsFetching || colorsStatus === "loading"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={colors?.map((color) => ({
                  label: color.name,
                  value: color.name,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Interior Color" name="interior_color">
              <Select
                mode="multiple"
                size="large"
                placeholder="Select Interior Colors"
                onDropdownVisibleChange={handleColorDropdownVisibleChange}
                loading={isColorsFetching || colorsStatus === "loading"}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={colors?.map((color) => ({
                  label: color.name,
                  value: color.name,
                }))}
              />
            </Form.Item>
          </Col>

          {/* ==== Registration & Ownership ==== */}
          <Col span={24}>
            <SubHeading title="Registration Details" />
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Chassis No./ VIN No."
              name="chasis_no"
              rules={[
                {
                  required: true,
                  message: "Please enter chassis number or vin number",
                },
              ]}
            >
              <Input size="large" placeholder="Unique Chassis No./ Vin No." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="Engine Number"
              name="engine_no"
              rules={[
                { required: true, message: "Please enter engine number" },
              ]}
            >
              <Input size="large" placeholder="Unique Engine No." />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Registration Number" name="reg_no">
              <Input size="large" placeholder="e.g. ABC-1234" />
            </Form.Item>
          </Col>

          {/* ==== Location & Price ==== */}
          <Col span={24}>
            <SubHeading title="Location & Pricing" />
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="State/ Province"
              name="state"
              rules={[{ required: true, message: "Please enter car location" }]}
            >
              <Input size="large" placeholder="e.g. MD" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Price" required>
              <Input.Group compact>
                <Form.Item
                  name="price"
                  noStyle
                  rules={[
                    { required: true, message: "Please enter car price" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    style={{ width: "60%" }}
                    placeholder="e.g. 13529"
                  />
                </Form.Item>
                <Form.Item
                  name="currency"
                  noStyle
                  rules={[
                    { required: true, message: "Please select currency" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "40%" }}
                    placeholder="Currency"
                  >
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="JPY">JPY</Select.Option>
                    <Select.Option value="ZAR">ZAR</Select.Option>
                    <Select.Option value="KES">KES</Select.Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item label="Mileage" required>
              <Input.Group compact>
                <Form.Item
                  name="mileage"
                  noStyle
                  rules={[{ required: true, message: "Please enter mileage" }]}
                >
                  <InputNumber
                    min={0}
                    size="large"
                    style={{ width: "70%" }}
                    placeholder="e.g. 111168"
                  />
                </Form.Item>
                <Form.Item
                  name="mileage_unit"
                  noStyle
                  rules={[{ required: true, message: "Select unit" }]}
                >
                  <Select
                    size="large"
                    style={{ width: "30%" }}
                    placeholder="Unit"
                  >
                    <Select.Option value="km">km</Select.Option>
                    <Select.Option value="mi">miles</Select.Option>
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          </Col>

          {/* ==== Other Details ==== */}
          <Col span={24}>
            <SubHeading title="Additional Details" />
          </Col>

          <Col xs={24}>
            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={4}
                size="large"
                placeholder="Write a brief description about the car..."
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Images" required={!isEdit}>
              <ImageUpload fileList={fileList} setFileList={setFileList} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <SubHeading title="Listing Settings" />
          </Col>

          <Col xs={24} sm={12} md={12} lg={8}>
            <Form.Item
              label="List on Website"
              name="should_list_on_website"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item>
              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isEdit ? "Update Car" : "Add Car"}
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default AddCar;
