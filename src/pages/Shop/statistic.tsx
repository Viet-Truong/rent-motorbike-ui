/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { DatePicker, Divider, Statistic, Table, TableColumnsType } from 'antd';
import ReactApexChart from 'react-apexcharts';
import dayjs, { Dayjs } from 'dayjs';
import * as shopServices from '@/services/shopServices';
import { useAppSelector } from '@/redux/hooks';
import { locale } from '@/utils/empty';

const { RangePicker } = DatePicker;

type RatioRent = {
  x: string;
  rent_cost?: number;
  y: string;
};
const StatisticMotorbike = () => {
  const user = useAppSelector((state) => state.auth.auth);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(7, 'day').format('DD-MM-YYYY')
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format('DD-MM-YYYY'));
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [totalRent, setTotalRent] = useState<string>('');
  const [rentRatio, setRentRatio] = useState<RatioRent[]>([]);
  const [chartDataLine, setChartDataLine] = useState({
    series: [
      {
        name: 'Doanh thu',
        type: 'line',
        data: [
          { x: '2023-01-01', y: 23 },
          { x: '2023-02-01', y: 42 },
          { x: '2023-03-01', y: 35 },
          { x: '2023-04-01', y: 27 },
          { x: '2023-05-01', y: 43 },
          { x: '2023-06-01', y: 22 },
          { x: '2023-07-01', y: 17 },
          { x: '2023-08-01', y: 31 },
          { x: '2023-09-01', y: 42 },
          { x: '2023-10-01', y: 22 },
          { x: '2023-11-01', y: 12 },
          { x: '2023-12-01', y: 16 },
        ],
      },
    ],
    options: {
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return `${(val / 1000000).toFixed(0)} VNĐ`;
          },
        },
        title: {
          text: 'Price',
        },
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val: any) {
            return `${(val / 1000000).toFixed(0)} VNĐ`;
          },
        },
      },
    },
  });

  const [chartDataColumn, setChartDataColumn] = useState({
    series: [
      {
        name: 'Tỉ lệ',
        type: 'bar',
        data: [
          { x: 'Honda', y: 23 },
          { x: 'Yamaha', y: 42 },
        ],
      },
    ],
    chart: {
      type: 'bar' as const,
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: any) {
        return val + '%';
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758'],
      },
    },
    xaxis: {
      position: 'top',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val: any) {
          return val + '%';
        },
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val: any) {
          return val + '%';
        },
      },
    },
  });

  const columns: TableColumnsType<RatioRent> = [
    {
      title: 'Tên xe',
      dataIndex: 'x',
      key: 'x',
      ellipsis: true,
    },
    {
      title: 'Giá thuê xe',
      dataIndex: 'rent_cost',
      key: 'rent_cost',
      ellipsis: true,
      render: (text) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        });
        return formatter.format(text);
      },
    },
    {
      title: 'Tỉ lệ thuê',
      dataIndex: 'y',
      render: (value, recode, index) => {
        console.log(recode, index);
        return `${value} %`;
      },
    },
  ];

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (!dates) return;
    const startDate = dates[0]?.format('DD-MM-YYYY');
    const endDate = dates[1]?.format('DD-MM-YYYY');
    setValue(dates);
    if (startDate && endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };

  useEffect(() => {
    const fetchTotalAmount = async () => {
      const res = await shopServices.getTotalAmount(user.shop_id);
      if (res.type === 'success') {
        setTotalAmount(res.data);
        setTotalRent(res.invoice_count);
      }
    };
    fetchTotalAmount();
  }, [user]);

  useEffect(() => {
    const fetchDataStatictis = async () => {
      if (startDate && endDate) {
        const res = await shopServices.getStatistic(user.shop_id, startDate, endDate);
        if (res.type === 'success') {
          setChartDataLine({
            series: [
              {
                name: 'Doanh thu',
                type: 'line',
                data: res.data,
              },
            ],
            options: {
              chart: {
                type: 'area',
                stacked: false,
                height: 350,
                zoom: {
                  type: 'x',
                  enabled: true,
                  autoScaleYaxis: true,
                },
                toolbar: {
                  autoSelected: 'zoom',
                },
              },
              dataLabels: {
                enabled: false,
              },
              markers: {
                size: 0,
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shadeIntensity: 1,
                  inverseColors: false,
                  opacityFrom: 0.5,
                  opacityTo: 0,
                  stops: [0, 90, 100],
                },
              },
              yaxis: {
                labels: {
                  formatter: function (val: any) {
                    return `${(val / 1000000).toFixed(0)} VNĐ`;
                  },
                },
                title: {
                  text: 'Price',
                },
              },
              xaxis: {
                type: 'datetime',
              },
              tooltip: {
                shared: false,
                y: {
                  formatter: function (val: any) {
                    return `${(val / 1000000).toFixed(0)} VNĐ`;
                  },
                },
              },
            },
          });
        }
      }
    };

    const fetchRentalRatio = async () => {
      if (startDate && endDate) {
        const res = await shopServices.rentalRatio(user.shop_id, startDate, endDate);

        if (res.type === 'success') {
          setRentRatio(res.data);
          setChartDataColumn({
            series: [
              {
                name: 'Tỉ lệ',
                type: 'bar',
                data: res.data,
              },
            ],
            chart: {
              type: 'bar',
              height: 350,
            },
            plotOptions: {
              bar: {
                borderRadius: 10,
                dataLabels: {
                  position: 'top',
                },
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function (val: any) {
                return val + '%';
              },
              offsetY: -20,
              style: {
                fontSize: '12px',
                colors: ['#304758'],
              },
            },
            xaxis: {
              position: 'top',
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              crosshairs: {
                fill: {
                  type: 'gradient',
                  gradient: {
                    colorFrom: '#D8E3F0',
                    colorTo: '#BED1E6',
                    stops: [0, 100],
                    opacityFrom: 0.4,
                    opacityTo: 0.5,
                  },
                },
              },
              tooltip: {
                enabled: true,
              },
            },
            yaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: false,
                formatter: function (val: any) {
                  return val + '%';
                },
              },
            },
            tooltip: {
              shared: false,
              y: {
                formatter: function (val: any) {
                  return val + '%';
                },
              },
            },
          });
        }
      }
    };

    fetchRentalRatio();
    fetchDataStatictis();
  }, [value, endDate, startDate, user]);

  return (
    <div style={{ padding: '10px', overflow: 'scroll', maxHeight: '90vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginRight: '8px',
        }}
      >
        <Statistic
          title='Tổng doanh thu'
          value={totalAmount}
          valueStyle={{ color: '#3f8600' }}
          suffix='VNĐ'
          style={{ padding: '20px', background: 'white', marginBottom: '8px', flex: '0 0 50%' }}
        />
        <Statistic
          title='Tổng số đơn hàng'
          value={totalRent}
          valueStyle={{ color: '#c10101' }}
          style={{ padding: '20px', background: 'white', marginBottom: '8px', flex: '0 0 50%' }}
        />
      </div>
      <p style={{ fontStyle: 'italic', fontSize: '12px', color: '#ccc', marginBottom: '4px' }}>
        * Chọn ngày bắt đầu và ngày kết thúc để hiển thị dữ liệu thống kê theo ý mun
      </p>
      <RangePicker
        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
        onChange={handleRangeChange}
        value={value}
      />
      <Divider orientation='left'>Thống kê doanh thu</Divider>
      <div
        id='chart'
        style={{ margin: '10px', padding: '10px', background: 'white', borderRadius: '8px' }}
      >
        <ReactApexChart
          options={chartDataLine}
          series={chartDataLine.series}
          type='area'
          height={350}
        />
      </div>
      <Divider orientation='left'>Thống kê tỉ lệ xe</Divider>
      <div
        id='chart'
        style={{ margin: '10px', padding: '10px', background: 'white', borderRadius: '8px' }}
      >
        <ReactApexChart
          options={chartDataColumn}
          series={chartDataColumn.series}
          type='bar'
          height={350}
        />
      </div>
      <div id='html-dist'></div>

      <Table
        columns={columns}
        dataSource={rentRatio}
        style={{ marginTop: '8px' }}
        locale={locale}
        rowKey={(record) => record.x}
      />
    </div>
  );
};

export default StatisticMotorbike;
