//
//  SiteListTableViewController.swift
//  ExilimDeviceController
//
//  Created by Kunihiko Ohnaka on 2017/10/04.
//  Copyright © 2017年 CASIO COMPUTER Co., LTD. All rights reserved.
//

import UIKit
import CoreData
import RxCocoa
import DConnectSDK

protocol BookmarkProtocol {
    var index: Int32 { get set }
    var name: String? { get set }
    var address: String? { get set }
}

extension Bookmark : BookmarkProtocol {
}

struct StaticBookmark : BookmarkProtocol {
    var index: Int32
    var name: String?
    var address: String?
}

class SiteListTableViewController: UITableViewController {
    fileprivate var _fetchedResultsController: NSFetchedResultsController<Bookmark>? = nil

    let defaultSites:[StaticBookmark] = [
        StaticBookmark(index: 0, name: "EXILIM Controller", address: "WebApps/Controller/index.html"),
        StaticBookmark(index: 1, name: "Device Connect Demo Site", address: "http://deviceconnectusers.github.io/manager/#demo")
    ]

    override func viewDidLoad() {
        // 編集、追加ボタンを表示
        navigationItem.leftBarButtonItem = editButtonItem
        let addButton = UIBarButtonItem(barButtonSystemItem: .add, target: self, action: #selector(insertNewObject(_:)))
        navigationItem.rightBarButtonItem = addButton

        // エッジスワイプはWKWebViewで使いたいので UINavigationControllerのエッジスワイプは無効にする
        self.navigationController?.interactivePopGestureRecognizer?.isEnabled = false

        self.updateEditButton()
    }
    
    fileprivate func updateEditButton() {
        let sectionInfo = self.fetchedResultsController.sections![0]
        let rows = sectionInfo.numberOfObjects
        self.navigationItem.leftBarButtonItem!.isEnabled = rows > 0 || self.tableView.isEditing
    }
    
    override func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch section {
        case 0:
            return defaultSites.count
        case 1:
            let sectionInfo = self.fetchedResultsController.sections![0]
            let rows = sectionInfo.numberOfObjects
            return rows
        default:
            abort()
        }
    }
    
    override func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        switch section {
        case 0:
            return "登録済のアプリ"
        case 1:
            return "追加したアプリ"
        default:
            abort()
        }
    }

    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        switch indexPath.section {
        case 0:
            return false
        case 1:
            return true
        default:
            abort()
        }
    }

    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        switch indexPath.section {
        case 0:
            return false
        case 1:
            return true
        default:
            abort()
        }
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "bookmarkCell", for: indexPath)
        self.configureCell(cell, atIndexPath: indexPath)
        return cell
    }

    func configureCell(_ cell: UITableViewCell, atIndexPath indexPath: IndexPath) {
        let bookmark: BookmarkProtocol
        switch indexPath.section {
        case 0:
            bookmark = defaultSites[indexPath.row]
        case 1:
            bookmark = self.fetchedResultsController.object(at: IndexPath(row: indexPath.row, section: 0))
        default:
            abort()
        }
        self.configureCell(cell, withBookmark: bookmark)
    }

    func configureCell(_ cell: UITableViewCell, withBookmark bookmark: BookmarkProtocol) {
        cell.textLabel!.text = "\(bookmark.name ?? "")"
        cell.detailTextLabel!.text = "\(bookmark.address ?? "")"
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let cell = self.tableView(self.tableView, cellForRowAt: indexPath)
        performSegue(withIdentifier: "openWebApp", sender: cell)
    }

    fileprivate var managedObjectContext: NSManagedObjectContext {
        return (UIApplication.shared.delegate as? AppDelegate)!.managedObjectContext
    }
    
    override func setEditing(_ editing: Bool, animated: Bool) {
        super.setEditing(editing, animated: animated)
        self.updateEditButton()
    }
}

extension SiteListTableViewController {
    @objc
    func insertNewObject(_ sender: Any) {
        self.inputNewSite()
    }
    
    private func inputNewSite(defaultName: String = "", defaultAddress: String = "") {
        let alert = UIAlertController(title: "サイトの追加", message: "名前とURLを入力してください", preferredStyle: .alert)
        alert.addTextField { (textField) in
            textField.placeholder = "名前"
            textField.text = defaultName
        }
        alert.addTextField { (textField) in
            textField.placeholder = "http://www.google.com/"
            textField.text = defaultAddress
        }
        let cancelAction = UIAlertAction(title: "キャンセル", style: .cancel) { (action) in
        }
        let okAction = UIAlertAction(title: "追加", style: .default) { [unowned alert] (action) in
            let name = alert.textFields?[0].text ?? ""
            let addrStr = alert.textFields?[1].text ?? ""
            guard !name.isEmpty else {
                self.retryInputNewSite(title: "名前を入力してください", name: name, address: addrStr)
                return
            }
            guard let url = URL(string: addrStr), url.scheme == "http" || url.scheme == "https" else {
                self.retryInputNewSite(title: "URLが不正です", message: "URLは http:// もしくは https:// を含めて入力してください。", name: name, address: addrStr)
                return
            }
            let context = self.fetchedResultsController.managedObjectContext
            let entity = self.fetchedResultsController.fetchRequest.entity!
            let newBookmark = NSEntityDescription.insertNewObject(forEntityName: entity.name!, into: context) as! Bookmark
            newBookmark.index = Int32(self.fetchedResultsController.sections![0].numberOfObjects)
            newBookmark.name = name
            newBookmark.address = url.absoluteString
            do {
                try context.save()
            } catch let error as NSError {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        }
        alert.addAction(cancelAction)
        alert.addAction(okAction)
        self.present(alert, animated: true) {
        }
    }

    private func retryInputNewSite(title: String, message: String? = nil, name: String, address: String) {
        DispatchQueue.main.async {
            let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
            let cancelAction = UIAlertAction(title: "OK", style: .cancel) { (action) in
                DispatchQueue.main.async {
                    self.inputNewSite(defaultName: name, defaultAddress: address)
                }
            }
            alert.addAction(cancelAction)
            self.present(alert, animated: true) {
            }
        }
    }
    
    
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCellEditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            let context = fetchedResultsController.managedObjectContext
            context.delete(fetchedResultsController.object(at: coreDataIndexPathOf(tableViewIndexPath: indexPath)!))

            self.renumberIndex(of: fetchedResultsController.fetchedObjects!)

            do {
                try context.save()
            } catch let error as NSError {
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        }
    }
    
    override func tableView(_ tableView: UITableView, moveRowAt sourceIndexPath: IndexPath, to destinationIndexPath: IndexPath) {
        let context = fetchedResultsController.managedObjectContext
        var bookmarks = fetchedResultsController.fetchedObjects!
        let target = bookmarks.remove(at: sourceIndexPath.row)
        bookmarks.insert(target, at: destinationIndexPath.row)
        self.renumberIndex(of: bookmarks)

        do {
            try context.save()
        } catch let error as NSError {
            fatalError("Unresolved error \(error), \(error.userInfo)")
        }
    }
    
    fileprivate func renumberIndex(of bookmarks: [Bookmark]) {
        for e in bookmarks.enumerated() {
            e.element.index = Int32(e.offset)
        }
    }
}

extension SiteListTableViewController : NSFetchedResultsControllerDelegate {
    var fetchedResultsController: NSFetchedResultsController<Bookmark> {
        if let controller = _fetchedResultsController {
            return controller
        }
        
        let fetchRequest: NSFetchRequest<Bookmark> = Bookmark.fetchRequest()
        fetchRequest.fetchBatchSize = 20
        let sortDescriptor = NSSortDescriptor(key: "index", ascending: true)
        fetchRequest.sortDescriptors = [sortDescriptor]
        
        let aFetchedResultsController = NSFetchedResultsController(fetchRequest: fetchRequest, managedObjectContext: self.managedObjectContext, sectionNameKeyPath: nil, cacheName: "Master")
        aFetchedResultsController.delegate = self
        _fetchedResultsController = aFetchedResultsController
        
        do {
            try _fetchedResultsController!.performFetch()
        } catch let error as NSError {
            fatalError("Unresolved error \(error), \(error.userInfo)")
        }
        
        return aFetchedResultsController
    }

    func controllerWillChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        tableView.beginUpdates()
    }
    
    func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChange sectionInfo: NSFetchedResultsSectionInfo, atSectionIndex sectionIndex: Int, for type: NSFetchedResultsChangeType) {
        switch type {
        case .insert:
            tableView.insertSections(IndexSet(integer: sectionIndex), with: .fade)
        case .delete:
            tableView.deleteSections(IndexSet(integer: sectionIndex), with: .fade)
        default:
            return
        }
    }
    
    func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChange anObject: Any, at coreDataIndexPath: IndexPath?, for type: NSFetchedResultsChangeType, newIndexPath newCoreDataIndexPath: IndexPath?) {
        let tableViewIndexPath = tableViewIndexPathOf(coreDataIndexPath: coreDataIndexPath)
        let newTableViewIndexPath = tableViewIndexPathOf(coreDataIndexPath: newCoreDataIndexPath)
        switch type {
        case .insert:
            tableView.insertRows(at: [newTableViewIndexPath!], with: .fade)
        case .delete:
            tableView.deleteRows(at: [tableViewIndexPath!], with: .fade)
        case .update:
            configureCell(tableView.cellForRow(at: tableViewIndexPath!)!, withBookmark: anObject as! Bookmark)
        case .move:
            configureCell(tableView.cellForRow(at: tableViewIndexPath!)!, withBookmark: anObject as! Bookmark)
            tableView.moveRow(at: tableViewIndexPath!, to: newTableViewIndexPath!)
        }
    }
    
    func controllerDidChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        tableView.endUpdates()
        self.updateEditButton()
    }
    
    func tableViewIndexPathOf(coreDataIndexPath: IndexPath?) -> IndexPath? {
        return coreDataIndexPath.map { IndexPath(row: $0.row, section: 1) }
    }
    
    func coreDataIndexPathOf(tableViewIndexPath: IndexPath?) -> IndexPath? {
        return tableViewIndexPath.map { IndexPath(row: $0.row, section: 0) }
    }
}

extension SiteListTableViewController {
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        guard segue.identifier == "openWebApp" else {
            return
        }
        guard let webVC = segue.destination as? WebViewController else {
            return
        }
        guard let cell = sender as? UITableViewCell else {
            return
        }
        guard let addr = cell.detailTextLabel?.text else {
            return
        }
        let url: URL
        if addr.starts(with: "http://") || addr.starts(with: "https://") {
            guard let u = URL(string: addr) else {
                return
            }
            url = u
        } else {
            let path = Bundle.main.bundlePath
            guard let u = URL(string: "file://\(path)/\(addr)") else {
                return
            }
            url = u
        }
        webVC.load(url: url)
    }
}
