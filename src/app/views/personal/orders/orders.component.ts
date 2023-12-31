import {Component, inject, OnInit} from '@angular/core';
import {OrderService} from "../../../shared/services/order.service";
import {OrderType} from "../../../../types/order.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {OrderStatusUtil} from "../../../shared/utils/order-status.util";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orderService = inject(OrderService);

  orders: OrderType[] = [];


  ngOnInit(): void {
    this.orderService.getAllOrders()
      .subscribe((data: OrderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.orders = (data as OrderType[]).map(item => {
          const status = OrderStatusUtil.getStatusAndColor(item.status);
          item.statusRus = status.name;
          item.color = status.color;
          return item;
        });
      });
  }

}
