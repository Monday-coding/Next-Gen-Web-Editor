#!/usr/bin/env python3
"""
啟動開發服務器
啟動 Vite 開發服務器並監控瀏覽器狀態
"""

import subprocess
import os
import time
import psutil
from datetime import datetime, timezone, timedelta

# 香港時區
HK_TZ = timezone(timedelta(hours=8))


def start_dev_server():
    """啟動開發服務器"""
    print("=" * 60)
    print("啟動開發服務器")
    print("=" * 60)
    print()
    
    try:
        # 1. 安裝依賴
        print("[第 1 步] 安裝依賴...")
        
        project_dir = '/home/jarvis/.openclaw/workspace/next-gen-web-editor'
        
        result = subprocess.run(
            ['npm', 'install'],
            cwd=project_dir,
            capture_output=True,
            text=True,
            timeout=600
        )
        
        if result.returncode == 0:
            print("  ✅ 依賴安裝成功")
        else:
            print(f"  ⚠️  依賴安裝失敗：{result.stderr}")
        
        print()
        
        # 2. 啟動 Vite 開發服務器
        print("[第 2 步] 啟動 Vite 開發服務器...")
        
        print("  正在啟動 Vite 服務器...")
        print(f"  項目路徑：{project_dir}")
        print(f"  服務器地址：http://localhost:3000")
        print()
        
        # 啟動服務器（後台運行）
        # 使用 nohup 和 & 讓服務器在後台運行
        # 並將輸出重定向到日誌文件
        log_file = os.path.join(project_dir, 'logs/vite.log')
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        # 構建啟動命令
        cmd = f'nohup npm run dev > {log_file} 2>&1 &'
        
        result = subprocess.run(
            cmd,
            cwd=project_dir,
            shell=True,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print("  ✅ Vite 服務器已啟動")
            print(f"  服務器地址：http://localhost:3000")
            print(f"  日誌文件：{log_file}")
        else:
            print(f"  ⚠️  Vite 服務器啟動失敗：{result.stderr}")
        
        print()
        
        # 3. 檢查瀏覽器狀態
        print("[第 3 步] 檢查瀏覽器狀態...")
        
        # 檢查端口是否被佔用
        for conn in psutil.net_connections():
            if conn.laddr.port == 3000:
                print(f"  ✅ 端口 3000 已被佔用")
                print(f"  進程 ID：{conn.pid}")
                print(f"  進程名稱：{conn.pid}")
                break
        else:
            print(f"  ⚠️  端口 3000 未被佔用，請稍等...")
        
        print()
        
        # 4. 總結
        print("=" * 60)
        print("開發服務器啟動完成")
        print("=" * 60)
        print()
        print("服務器信息：")
        print(f"  項目路徑：{project_dir}")
        print(f"  服務器地址：http://localhost:3000")
        print(f"  日誌文件：{log_file}")
        print()
        print("下一步：")
        print("  1. 在瀏覽器中打開 http://localhost:3000")
        print("  2. 查看編輯器界面")
        print("  3. 繼續開發功能")
        print()
        print("提示：")
        print("  - 服務器正在後台運行")
        print("  - 可以使用 Ctrl + C 停止服務器")
        print("  - 可以查看日誌文件了解服務器狀態")
        print()
        
        return True
    
    except Exception as e:
        print(f"  ❌ 啟動失敗：{e}")
        return False


def main():
    """主函數 - 啟動開發服務器"""
    print("啟動開發服務器")
    print("=" * 60)
    print()
    print("這個腳本會：")
    print("  1. 安裝依賴")
    print("  2. 啟動 Vite 開發服務器")
    print("  3. 檢查瀏覽器狀態")
    print()
    print("準備開始...")
    print()
    print("=" * 60)
    print()
    
    # 啟動開發服務器
    start_dev_server()


if __name__ == "__main__":
    main()
