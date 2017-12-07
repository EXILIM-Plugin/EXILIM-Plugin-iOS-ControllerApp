//
//  HelpListTableViewController.swift
//  ExilimDeviceController
//
//  Created by Kunihiko Ohnaka on 2017/11/01.
//  Copyright © 2017年 CASIO COMPUTER Co., LTD. All rights reserved.
//

import Foundation
import UIKit

class HelpListTableViewController: UITableViewController {
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let cell = self.tableView(self.tableView, cellForRowAt: indexPath)

        guard let urlStr = cell.detailTextLabel?.text else {
            return
        }
        guard let url = URL(string: urlStr) else {
            return
        }
        
        UIApplication.shared.openURL(url)
    }
}
